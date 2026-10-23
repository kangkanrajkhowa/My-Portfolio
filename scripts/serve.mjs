import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out", import.meta.url));
const portArgIndex = process.argv.indexOf("--port");
const port = Number(
  portArgIndex > -1 ? process.argv[portArgIndex + 1] : process.env.PORT || 4173,
);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const clean = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  let candidate = path.join(root, clean);

  if (clean.endsWith("/") || clean === "/") {
    candidate = path.join(candidate, "index.html");
  }

  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    candidate = path.join(candidate, "index.html");
  }

  if (!fs.existsSync(candidate) && !path.extname(candidate)) {
    const withIndex = path.join(candidate, "index.html");
    if (fs.existsSync(withIndex)) return withIndex;
    const withHtml = `${candidate}.html`;
    if (fs.existsSync(withHtml)) return withHtml;
  }

  return candidate;
}

const server = http.createServer((request, response) => {
  const file = resolveFile(request.url ?? "/");

  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    const fallback = path.join(root, "404.html");
    if (fs.existsSync(fallback)) {
      response.writeHead(404, { "Content-Type": types[".html"] });
      response.end(fs.readFileSync(fallback));
      return;
    }
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Not found");
    return;
  }

  const ext = path.extname(file);
  const compressible = new Set([
    ".html",
    ".css",
    ".js",
    ".mjs",
    ".json",
    ".svg",
    ".txt",
    ".xml",
  ]);
  const acceptsGzip = /\bgzip\b/.test(request.headers["accept-encoding"] ?? "");

  if (compressible.has(ext) && acceptsGzip) {
    response.writeHead(200, {
      "Content-Type": types[ext] ?? "application/octet-stream",
      "Content-Encoding": "gzip",
      Vary: "Accept-Encoding",
      "Cache-Control": "no-cache",
    });
    fs.createReadStream(file).pipe(zlib.createGzip()).pipe(response);
    return;
  }

  response.writeHead(200, {
    "Content-Type": types[ext] ?? "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  fs.createReadStream(file).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`[serve] http://127.0.0.1:${port}`);
});

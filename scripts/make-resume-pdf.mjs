import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = path.join(root, "out");
const target = path.join(outDir, "resume.pdf");
const port = 4188;

if (!(await fs.stat(outDir).catch(() => null))) {
  console.error("[pdf] out/ is missing — run `npm run build` first.");
  process.exit(1);
}

const server = spawn(
  process.execPath,
  [path.join(root, "scripts", "serve.mjs"), "--port", String(port)],
  { stdio: "ignore" },
);

const waitForServer = async () => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/resume/`);
      if (response.ok) return true;
    } catch {
      // keep waiting
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return false;
};

try {
  const ready = await waitForServer();
  if (!ready) throw new Error("static server did not start");

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/resume/`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: target,
    format: "A4",
    printBackground: false,
    margin: { top: "14mm", right: "12mm", bottom: "14mm", left: "12mm" },
  });
  await browser.close();

  const stats = await fs.stat(target);
  console.log(`[pdf] wrote out/resume.pdf (${(stats.size / 1024).toFixed(0)} KB)`);
} catch (error) {
  console.warn(`[pdf] skipped (${error.message})`);
  process.exitCode = 0;
} finally {
  server.kill();
}

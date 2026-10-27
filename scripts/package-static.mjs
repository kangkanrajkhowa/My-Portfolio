/**
 * Bundles the static export into an upload-ready zip for hosts where you would
 * rather use the file manager than CI. Writes dist/kangkan.dev-static.zip with
 * the matching server config already inside.
 *
 *   npm run package:static                  # Apache / LiteSpeed (.htaccess)
 *   npm run package:static -- --server nginx
 *   npm run package:static -- --server iis
 *
 * The zip is produced with Node's own zlib — no archiver dependency, and no
 * reliance on a `zip` binary that Windows does not ship.
 */
import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = path.join(root, "out");
const distDir = path.join(root, "dist");
const DOMAIN = "kangkan.dev";

const CONFIGS = {
  apache: {
    source: "deploy/apache/.htaccess",
    // Must land in the document root, so it goes inside the archive.
    insideArchive: ".htaccess",
  },
  iis: {
    source: "deploy/iis/web.config",
    insideArchive: "web.config",
  },
  nginx: {
    source: "deploy/nginx/portfolio.conf",
    // A .conf in a web root is downloadable — ship it beside the archive.
    insideArchive: null,
  },
};

const argIndex = process.argv.indexOf("--server");
const server = (argIndex !== -1 ? process.argv[argIndex + 1] : "apache") ?? "apache";
const config = CONFIGS[server];

if (!config) {
  console.error(
    `[package] unknown server "${server}" — expected one of: ${Object.keys(CONFIGS).join(", ")}`,
  );
  process.exit(1);
}

if (!(await fs.stat(outDir).catch(() => null))) {
  console.error("[package] out/ is missing — run `npm run build` first.");
  process.exit(1);
}

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let value = i;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[i] = value;
  }
  return table;
})();

function crc32(buffer) {
  let value = -1;
  for (let i = 0; i < buffer.length; i += 1) {
    value = CRC_TABLE[(value ^ buffer[i]) & 0xff] ^ (value >>> 8);
  }
  return (value ^ -1) >>> 0;
}

function dosTimestamp(date) {
  return {
    time:
      (date.getHours() << 11) |
      (date.getMinutes() << 5) |
      Math.floor(date.getSeconds() / 2),
    date:
      ((date.getFullYear() - 1980) << 9) |
      ((date.getMonth() + 1) << 5) |
      date.getDate(),
  };
}

async function collect(dir, base = "") {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = base ? `${base}/${entry.name}` : entry.name;
    const absolute = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collect(absolute, relative)));
      continue;
    }
    if (!entry.isFile()) continue;
    // Pages/OS droppings that have no business on the new host.
    if (entry.name === ".DS_Store" || entry.name === ".nojekyll") continue;

    files.push({ name: relative, absolute });
  }

  return files;
}

function createZip(entries) {
  const local = [];
  const central = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuffer = Buffer.from(entry.name, "utf8");
    const raw = entry.data;
    const checksum = crc32(raw);
    const deflated = zlib.deflateRawSync(raw, { level: 9 });
    const compressed = deflated.length < raw.length;
    const body = compressed ? deflated : raw;
    const method = compressed ? 8 : 0;
    const stamp = dosTimestamp(entry.mtime);

    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0x0800, 6); // UTF-8 filenames
    header.writeUInt16LE(method, 8);
    header.writeUInt16LE(stamp.time, 10);
    header.writeUInt16LE(stamp.date, 12);
    header.writeUInt32LE(checksum, 14);
    header.writeUInt32LE(body.length, 18);
    header.writeUInt32LE(raw.length, 22);
    header.writeUInt16LE(nameBuffer.length, 26);
    header.writeUInt16LE(0, 28);

    local.push(header, nameBuffer, body);

    const directory = Buffer.alloc(46);
    directory.writeUInt32LE(0x02014b50, 0);
    directory.writeUInt16LE(20, 4);
    directory.writeUInt16LE(20, 6);
    directory.writeUInt16LE(0x0800, 8);
    directory.writeUInt16LE(method, 10);
    directory.writeUInt16LE(stamp.time, 12);
    directory.writeUInt16LE(stamp.date, 14);
    directory.writeUInt32LE(checksum, 16);
    directory.writeUInt32LE(body.length, 20);
    directory.writeUInt32LE(raw.length, 24);
    directory.writeUInt16LE(nameBuffer.length, 28);
    directory.writeUInt16LE(0, 30);
    directory.writeUInt16LE(0, 32);
    directory.writeUInt16LE(0, 34);
    directory.writeUInt16LE(0, 36);
    directory.writeUInt32LE((0o100644 << 16) >>> 0, 38);
    directory.writeUInt32LE(offset, 42);

    central.push(directory, nameBuffer);
    offset += header.length + nameBuffer.length + body.length;
  }

  const directory = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([...local, directory, end]);
}

const files = await collect(outDir);

const configSource = path.join(root, config.source);
const configData = await fs.readFile(configSource).catch(() => null);
if (!configData) {
  console.error(`[package] server config missing: ${config.source}`);
  process.exit(1);
}

const entries = await Promise.all(
  files.map(async (file) => ({
    name: file.name,
    data: await fs.readFile(file.absolute),
    mtime: (await fs.stat(file.absolute)).mtime,
  })),
);

if (config.insideArchive) {
  entries.push({
    name: config.insideArchive,
    data: configData,
    mtime: new Date(),
  });
}

await fs.mkdir(distDir, { recursive: true });

const archive = path.join(distDir, `${DOMAIN}-static.zip`);
await fs.writeFile(archive, createZip(entries));

if (!config.insideArchive) {
  const beside = path.join(distDir, `${DOMAIN}-nginx.conf`);
  await fs.writeFile(beside, configData);
  console.log(
    `[package] wrote ${path.relative(root, beside)} — upload it to /etc/nginx/sites-available/ on the server, not the web root.`,
  );
}

const megabytes = (await fs.stat(archive)).size / 1024 / 1024;
console.log(
  `[package] ${entries.length} files → ${path.relative(root, archive)} (${megabytes.toFixed(1)} MB, ${server} config)`,
);
console.log("[package] upload and extract in the hosting file manager, into the document root.");

import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = path.join(root, "out");
const target = path.join(outDir, "resume.pdf");
const port = 4188;

/**
 * Education belongs in the CV document but is deliberately not published on the
 * site, so it is injected into the print copy only — this lives outside src/ so
 * no page, sitemap entry or structured data can pick it up.
 */
const education = [
  {
    degree: "Master of Computer Applications (MCA)",
    org: "Cotton University",
    period: "Aug 2015 — Jun 2018",
    location: "Guwahati, Assam",
  },
  {
    degree: "B.Sc in Zoology",
    org: "Chaiduar College, Gauhati University",
    period: "Aug 2012 — Jul 2015",
    location: "Gohpur, Assam",
  },
];

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
  const injected = await page.evaluate((items) => {
    const heading = [...document.querySelectorAll("h2")].find(
      (element) => element.textContent?.trim() === "Skills",
    );
    const skills = heading?.closest("section");
    if (!skills) return false;

    const section = document.createElement("section");
    section.setAttribute("data-print-only", "education");
    section.style.marginTop = "1.75rem";

    const title = document.createElement("h2");
    title.textContent = "Education";
    title.style.cssText =
      "font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.18em;color:#737373";
    section.append(title);

    const list = document.createElement("div");
    list.style.marginTop = "0.75rem";

    for (const [index, item] of items.entries()) {
      const row = document.createElement("div");
      if (index > 0) row.style.marginTop = "0.625rem";

      const line = document.createElement("div");
      line.style.cssText =
        "display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem";

      const degree = document.createElement("h3");
      degree.textContent = item.degree;
      degree.style.cssText = "font-size:12px;font-weight:600";

      const period = document.createElement("span");
      period.textContent = item.period;
      period.style.cssText = "font-size:11px;color:#737373";

      line.append(degree, period);

      const org = document.createElement("p");
      org.textContent = `${item.org} · ${item.location}`;
      org.style.cssText = "font-size:11px;color:#525252";

      row.append(line, org);
      list.append(row);
    }

    section.append(list);
    skills.before(section);
    return true;
  }, education);
  if (!injected) throw new Error("could not place the education section");
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

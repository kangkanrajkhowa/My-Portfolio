import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = path.join(root, "public", "og.png");

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap");
      * { box-sizing: border-box; margin: 0; }
      body {
        width: 1200px; height: 630px; overflow: hidden;
        background: #08090c; color: #ededef;
        font-family: Inter, system-ui, sans-serif;
        position: relative; display: flex; flex-direction: column; justify-content: space-between;
        padding: 72px;
      }
      .glow-a { position: absolute; width: 620px; height: 620px; border-radius: 999px; background: #7c5cff; opacity: .22; filter: blur(90px); top: -220px; right: -120px; }
      .glow-b { position: absolute; width: 520px; height: 520px; border-radius: 999px; background: #c6f24e; opacity: .16; filter: blur(100px); bottom: -240px; left: -80px; }
      .grid { position: absolute; inset: 0; opacity: .06;
        background-image: linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px);
        background-size: 48px 48px; }
      .top { display: flex; justify-content: space-between; align-items: center; font-size: 15px; letter-spacing: .22em; text-transform: uppercase; color: #8a8f98; position: relative; }
      .dot { display: inline-block; width: 8px; height: 8px; border-radius: 999px; background: #c6f24e; margin-right: 10px; }
      h1 { position: relative; font-size: 96px; line-height: .92; letter-spacing: -.045em; font-weight: 600; }
      h1 em { font-family: "Instrument Serif", Georgia, serif; font-style: italic; font-weight: 400; color: #c6f24e; }
      .bottom { position: relative; display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid rgba(255,255,255,.12); padding-top: 26px; }
      .bottom p { font-size: 22px; color: #8a8f98; max-width: 620px; line-height: 1.4; }
      .badges { display: flex; gap: 10px; }
      .badge { border: 1px solid rgba(255,255,255,.16); border-radius: 999px; padding: 8px 16px; font-size: 15px; color: #c9ccd2; }
      .badge.hot { background: #c6f24e; color: #0a0b06; border-color: #c6f24e; font-weight: 600; }
    </style>
  </head>
  <body>
    <div class="grid"></div>
    <div class="glow-a"></div>
    <div class="glow-b"></div>

    <div class="top">
      <span><span class="dot"></span>Guwahati, Assam · Available for work</span>
      <span>Portfolio 2026</span>
    </div>

    <h1>Fullstack developer<br />&amp; <em>UI/UX designer</em>.</h1>

    <div class="bottom">
      <p>Kangkan Rajkhowa — Laravel, React, PostgreSQL and practical AI. Building public-sector platforms and products that last.</p>
      <div class="badges">
        <span class="badge hot">Senior dev @ NIC</span>
        <span class="badge">AI &amp; ML</span>
      </div>
    </div>
  </body>
</html>`;

try {
  await fs.mkdir(path.join(root, "public"), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: out, type: "png" });
  await browser.close();
  console.log(`[og] wrote ${path.relative(root, out)}`);
} catch (error) {
  console.warn(
    `[og] skipped (${error.message}). Install Playwright browsers with: npx playwright install chromium`,
  );
}

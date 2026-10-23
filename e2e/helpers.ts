import { expect, type Page } from "@playwright/test";

/** Marks the session as visited so the preloader is skipped, then loads a page. */
export async function visit(page: Page, path = "/") {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("kr-visited", "1");
    } catch {
      // ignore storage restrictions
    }
  });
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator("main#main")).toBeVisible();
  // Wait for client hydration so interactive handlers exist before we act.
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true",
    undefined,
    { timeout: 15_000 },
  );
}

export function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      const text = message.text();
      if (!text.includes("WebGL") && !text.includes("THREE")) {
        errors.push(text);
      }
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

import { expect, test } from "@playwright/test";
import { visit } from "./helpers";

test.describe("mobile navigation", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) > 800, "mobile only");

  test("opens the menu and jumps to a section", async ({ page }) => {
    await visit(page);
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();

    await page.getByRole("navigation", { name: "Mobile" }).getByRole("button", { name: "Work" }).click();
    await page.waitForTimeout(900);
    const top = await page.locator("#work").evaluate((el) => el.getBoundingClientRect().top);
    expect(Math.abs(top)).toBeLessThan(260);
  });
});

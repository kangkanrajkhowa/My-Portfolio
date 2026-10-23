import { expect, test } from "@playwright/test";
import { visit } from "./helpers";

test.describe("mobile navigation", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) > 800, "mobile only");

  test("opens the menu and jumps to a section", async ({ page }) => {
    await visit(page);
    await page.getByRole("button", { name: "Open menu" }).click();

    const nav = page.getByRole("navigation", { name: "Mobile" });
    await expect(nav).toBeVisible();

    // Force the click: the overlay becomes inert as soon as the item is
    // activated, which makes Playwright's actionability check retry forever.
    await nav.getByRole("button", { name: "Work" }).click({ force: true });

    await expect
      .poll(
        async () =>
          Math.abs(
            await page
              .locator("#work")
              .evaluate((element) => element.getBoundingClientRect().top),
          ),
        { timeout: 12_000 },
      )
      .toBeLessThan(320);
  });
});

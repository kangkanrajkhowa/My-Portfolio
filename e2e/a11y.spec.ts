import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { visit } from "./helpers";

for (const path of ["/", "/work/egras-assam-web/", "/resume/"]) {
  test(`no serious accessibility violations on ${path}`, async ({ page }) => {
    await visit(page, path);
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const serious = results.violations.filter(
      (violation) =>
        violation.impact === "serious" || violation.impact === "critical",
    );

    expect(
      serious.map((violation) => `${violation.id}: ${violation.help}`),
    ).toEqual([]);
  });
}

import { expect, test } from "@playwright/test";
import { collectErrors, visit } from "./helpers";

test.describe("home", () => {
  test("renders the hero and every section", async ({ page }) => {
    const errors = collectErrors(page);
    await visit(page);

    await expect(page).toHaveTitle(/Kangkan Rajkhowa/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Kangkan");

    for (const id of ["about", "skills", "work", "experience", "stats", "ask", "contact"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }

    expect(errors).toEqual([]);
  });

  test("anchor navigation moves to a section", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) < 800, "desktop nav only");
    await visit(page);
    await page.getByRole("button", { name: "Work", exact: true }).first().click();
    await page.waitForTimeout(900);
    const top = await page.locator("#work").evaluate((el) => el.getBoundingClientRect().top);
    expect(Math.abs(top)).toBeLessThan(220);
  });
});

test.describe("command palette", () => {
  test("opens with the keyboard, finds a project and closes", async ({ page }) => {
    await visit(page);
    await page.keyboard.press("ControlOrMeta+k");
    const input = page.locator("[cmdk-input]");
    await expect(input).toBeVisible();

    await input.fill("egras");
    await expect(
      page.getByRole("option", { name: /eGRAS Assam — Web/ }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(input).toBeHidden();
  });
});

test.describe("skills", () => {
  test("filters the grid by group", async ({ page }) => {
    await visit(page);
    await page.locator("#skills").scrollIntoViewIfNeeded();

    const grid = page.locator("#skills ul");

    await page.getByRole("button", { name: "AI & ML", exact: true }).click();
    await expect(grid.getByText("LLM API integration")).toBeVisible();
    await expect(grid.getByText("Laravel", { exact: true })).toHaveCount(0);

    await page.getByRole("button", { name: "All", exact: true }).click();
    await expect(grid.getByText("Laravel", { exact: true })).toBeVisible();
  });
});

test.describe("work", () => {
  test("cards link to their case studies", async ({ page }) => {
    await visit(page);
    const card = page.locator('a[href="/work/city-center-store-directory/"]').first();
    await expect(card).toHaveCount(1);
    await expect(card).toContainText("City Center Store Directory");
  });

  test("case study page renders", async ({ page }) => {
    await visit(page, "/work/egras-assam-web/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("eGRAS Assam");
    await expect(page.getByText("The problem")).toBeVisible();
    await expect(page.getByText("The outcome")).toBeVisible();
  });
});

test.describe("theme", () => {
  test("toggles and persists across reloads", async ({ page }) => {
    await visit(page);
    const html = page.locator("html");

    await page.getByRole("button", { name: /Switch to light theme/i }).click();
    await expect(html).toHaveAttribute("data-theme", "light");

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(html).toHaveAttribute("data-theme", "light");
  });
});

test.describe("contact", () => {
  test("blocks empty and malformed submissions", async ({ page }) => {
    await visit(page);
    await page.locator("#contact").scrollIntoViewIfNeeded();

    await page.locator('#contact button[type="submit"]').click();
    await expect(page.getByText("Tell me your name.")).toBeVisible();
    await expect(page.getByText("A valid email so I can reply.")).toBeVisible();

    await page.locator("#name").fill("Test Person");
    await page.locator("#email").fill("not-an-email");
    await page.locator("#message").fill("A short enquiry about a project.");
    await page.locator('#contact button[type="submit"]').click();
    await expect(page.getByText("A valid email so I can reply.")).toBeVisible();
  });
});

test.describe("assistant", () => {
  test("answers a curated question", async ({ page }) => {
    await visit(page);
    await page.locator("#ask").scrollIntoViewIfNeeded();
    await page.locator("#ask-input").fill("Tell me about eGRAS");
    await page.locator('#ask button[type="submit"]').click();

    await expect(
      page.getByText(/Government Receipt Accounting System/i).last(),
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("resume", () => {
  test("renders the résumé page", async ({ page }) => {
    await visit(page, "/resume/");
    await expect(page.getByRole("heading", { name: "Kangkan Rajkhowa" })).toBeVisible();
    await expect(page.getByText("Experience")).toBeVisible();
  });
});

test.describe("404", () => {
  test("unknown routes render the not-found page", async ({ page }) => {
    await page.goto("/this-page-does-not-exist/", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Error 404")).toBeVisible();
  });
});

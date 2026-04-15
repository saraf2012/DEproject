import { test, expect } from "@playwright/test";

test("user filters home list by tag chip", async ({ page }) => {
  await page.goto("/");
  const ritual = page.getByTestId("tag-filter-ritual");
  await expect(ritual).toBeVisible();
  await ritual.click();
  await expect(page.getByText("Quiet Morning Rituals", { exact: false })).toBeVisible();
});

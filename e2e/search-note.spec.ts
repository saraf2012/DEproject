import { test, expect } from "@playwright/test";

test("user searches and sees matching seed content", async ({ page }) => {
  await page.goto("/search?q=architecture");
  await expect(page.getByTestId("search-page-input")).toHaveValue("architecture");
  await expect(page.getByText("Designing the Digital Vellum", { exact: false })).toBeVisible();
});

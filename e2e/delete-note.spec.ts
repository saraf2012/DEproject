import { test, expect } from "@playwright/test";

test("user deletes a note from the expanded view", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("new-note-fab").click();
  await page.getByTestId("note-title").fill("Note to delete");
  // Editor debounces autosave (~400ms); wait before leaving so the title persists.
  await page.waitForTimeout(600);
  await page.locator('header a[href="/"]').first().click();
  await expect(page).toHaveURL("/");
  await page.getByTestId("note-card-title").filter({ hasText: "Note to delete" }).click();
  await page.getByTestId("delete-note").click();
  await expect(page).toHaveURL("/");
  await expect(page.getByText("Note to delete")).toHaveCount(0);
});

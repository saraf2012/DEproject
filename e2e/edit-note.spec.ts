import { test, expect } from "@playwright/test";

test("user edits an existing note from the list", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("note-card").first().click();
  await expect(page).toHaveURL(/\/expanded\//);
  await page.getByTestId("edit-note").click();
  await expect(page).toHaveURL(/\/editor\//);
  await page.getByTestId("note-title").fill("Edited by E2E");
  await expect(page.getByTestId("note-title")).toHaveValue("Edited by E2E");
});

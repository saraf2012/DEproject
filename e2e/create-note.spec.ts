import { test, expect } from "@playwright/test";

test("user creates a new note and sees the title in the editor", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("new-note-fab").click();
  await expect(page).toHaveURL(/\/editor\//);
  await page.getByTestId("note-title").fill("E2E fresh note");
  await page.getByTestId("note-body").click();
  await page.keyboard.type(" Hello from Playwright.");
  await expect(page.getByTestId("note-title")).toHaveValue("E2E fresh note");
});

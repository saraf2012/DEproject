import { test, expect } from "@playwright/test";

test("user applies a meeting template in the editor", async ({ page }) => {
  await page.goto("/editor");
  await expect(page).toHaveURL(/\/editor\//);
  await page.getByTestId("template-picker").selectOption("meeting");
  await expect(page.getByTestId("note-title")).toHaveValue("Meeting notes");
  await expect(page.getByTestId("note-body")).toContainText("Attendees");
});

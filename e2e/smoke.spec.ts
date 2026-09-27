import { expect, test } from "@playwright/test";

test("landing to complete console workflow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("One platform for market intelligence. Search, reason, decide.")).toBeVisible();
  await page.getByRole("link", { name: "Log in" }).first().click();
  await page.getByTestId("demo-login").click();
  await expect(page.getByTestId("dashboard-page")).toBeVisible();

  await page.getByRole("link", { name: "Explorer" }).click();
  await expect(page.getByTestId("explorer-page")).toBeVisible();
  await page.getByTestId("explorer-search").fill("Nvidia");
  await expect(page.getByTestId("result-count")).toContainText("5 results");
  await expect(page.getByTestId("document-viewer")).toBeVisible();

  await page.getByRole("link", { name: "Assistant", exact: true }).click();
  await page.getByTestId("assistant-input").fill("What changed in AI spending?");
  await page.getByTestId("assistant-send").click();
  await expect(page.getByTestId("assistant-citations")).toBeVisible();

  await page.getByRole("link", { name: "Integrations" }).click();
  await page.getByTestId("create-key-open").click();
  await page.getByTestId("key-name").fill("Playwright smoke");
  await page.getByTestId("create-key-submit").click();
  await expect(page.getByTestId("key-secret")).toContainText("demo_secret");
  await page.getByRole("button", { name: "I have saved my key" }).click();
  await expect(page.getByText("Playwright smoke")).toBeVisible();
  await page.getByLabel("Revoke Playwright smoke").click();
  await expect(page.getByText("Playwright smoke")).toBeHidden();

  await page.getByRole("link", { name: "Analytics" }).click();
  await expect(page.getByTestId("analytics-page")).toBeVisible();
  await page.getByRole("link", { name: "Settings" }).click();
  await expect(page.getByTestId("settings-page")).toBeVisible();
});

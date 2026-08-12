import { expect, test, type Page } from "@playwright/test";

const PRIVATE_PIN = "wana";

async function unlockIfNeeded(page: Page) {
  const input = page.getByTestId("access-pin-input");
  if (await input.isVisible()) {
    await input.fill(PRIVATE_PIN);
    await page.getByTestId("access-unlock-button").click();
    await expect(page.locator(".hero-copy h1")).toHaveText(/for reeja, my mutu/i);
  }
}

test("requires PIN and unlocks with valid code", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /enter our code/i })).toBeVisible();
  await page.getByTestId("access-pin-input").fill("wrong-pin");
  await page.getByTestId("access-unlock-button").click();
  await expect(page.getByTestId("access-pin-error")).toContainText(/almost|close/i);

  await page.getByTestId("access-pin-input").fill(PRIVATE_PIN);
  await page.getByTestId("access-unlock-button").click();
  await expect(page.locator(".hero-copy h1")).toHaveText(/for reeja, my mutu/i);
});

test("opens a memory detail modal from memory lane", async ({ page }) => {
  await page.goto("/");
  await unlockIfNeeded(page);

  await page.getByRole("button", { name: /relive/i }).click();
  await expect(page.getByRole("heading", { name: /our timeline/i })).toBeVisible();

  await page.getByRole("button", { name: /open memory the first moment/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText(/one small tap, one big beginning/i)).toBeVisible();
  await page.getByRole("button", { name: /^close$/i }).click();
});

test("persists coupon redemption after reload", async ({ page }) => {
  await page.goto("/");
  await unlockIfNeeded(page);

  await page.getByRole("button", { name: /promises/i }).click();
  await expect(page.getByRole("heading", { name: /promises/i })).toBeVisible();

  const firstCoupon = page.locator(".coupon-card:not([disabled])").first();
  await firstCoupon.click();
  await expect(firstCoupon.getByText(/undo/i)).toBeVisible();

  await page.reload();
  await unlockIfNeeded(page);

  await page.getByRole("button", { name: /promises/i }).click();
  const firstCouponAfterReload = page.locator(".coupon-card:not([disabled])").first();
  await expect(firstCouponAfterReload.getByText(/undo/i)).toBeVisible();
});

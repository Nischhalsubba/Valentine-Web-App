import { expect, test, type Page } from "@playwright/test";

const PRIVATE_PIN = "mutu2026";

async function unlockIfNeeded(page: Page) {
  const input = page.getByTestId("access-pin-input");
  if (await input.isVisible()) {
    await input.fill(PRIVATE_PIN);
    await page.getByTestId("access-unlock-button").click();
    await expect(page.locator(".hero-copy h1")).toHaveText(/small place where our memories live/i);
  }
}

test("requires PIN and unlocks with valid code", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /mutu memoir is locked/i })).toBeVisible();
  await page.getByTestId("access-pin-input").fill("wrong-pin");
  await page.getByTestId("access-unlock-button").click();
  await expect(page.getByTestId("access-pin-error")).toContainText("Wrong PIN");

  await page.getByTestId("access-pin-input").fill(PRIVATE_PIN);
  await page.getByTestId("access-unlock-button").click();
  await expect(page.locator(".hero-copy h1")).toHaveText(/small place where our memories live/i);
});

test("opens a memory detail modal from memory lane", async ({ page }) => {
  await page.goto("/");
  await unlockIfNeeded(page);

  await page.getByRole("button", { name: /memory/i }).click();
  await expect(page.getByRole("heading", { name: /our chapters/i })).toBeVisible();

  await page.getByRole("button", { name: /open memory: the first moment/i }).click();
  await expect(page.getByRole("dialog", { name: /memory detail/i })).toBeVisible();
  await expect(page.getByText(/one small tap, one big beginning/i)).toBeVisible();
  await page.getByRole("button", { name: /^close$/i }).click();
});

test("persists coupon redemption after reload", async ({ page }) => {
  await page.goto("/");
  await unlockIfNeeded(page);

  await page.getByRole("button", { name: /promise/i }).click();
  await expect(page.getByRole("heading", { name: /happy valentine's day, reeja/i })).toBeVisible();

  const firstCoupon = page.locator(".coupon-card").first();
  await firstCoupon.click();
  await expect(firstCoupon.getByText(/redeemed/i)).toBeVisible();

  await page.reload();
  await unlockIfNeeded(page);

  await page.getByRole("button", { name: /promise/i }).click();
  const firstCouponAfterReload = page.locator(".coupon-card").first();
  await expect(firstCouponAfterReload.getByText(/redeemed/i)).toBeVisible();
});

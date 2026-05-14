
import { test, expect } from "@playwright/test";

test.use({ timezoneId: "UTC" });

test.describe("Loyalty points credited to correct calendar day in customer timezone", () => {
  test("order at 00:30 CEST (22:30 UTC previous day) buckets to the CEST date", async ({ page }) => {
    // 2025-06-15 00:30:00 +02:00 (CEST) = 2025-06-14 22:30:00 UTC.
    // Server-local Date in a UTC container reports 2025-06-14, but the
    // customer is in CEST so the correct loyalty day is 2025-06-15.
    const orderIso = "2025-06-14T22:30:00Z";
    await page.goto(`/checkout?orderTime=${encodeURIComponent(orderIso)}`);

    await expect(page.locator('[data-testid="loyalty-day"]')).toContainText(
      "2025-06-15",
      { timeout: 5_000 },
    );
  });

  test("order at 23:30 CET (22:30 UTC same day, winter) buckets to that CET date", async ({ page }) => {
    const orderIso = "2025-01-15T22:30:00Z";
    await page.goto(`/checkout?orderTime=${encodeURIComponent(orderIso)}`);

    await expect(page.locator('[data-testid="loyalty-day"]')).toContainText(
      "2025-01-15",
      { timeout: 5_000 },
    );
  });
});

// Phase 20-10 (D-09 incident C, D-13 validation flow):
// INC-C — "Loyalty TZ bug — server-local time used to bucket SubClub points"
//
// Symptom shown to participants:
//   "Customer report: 'My SubClub points were credited to yesterday — I checked
//    out at 00:30.'"
//
// Root cause (hidden from participants): lib/loyalty.ts → `bucketLoyaltyDay`
// reads the server's local timezone via Date#getFullYear/getMonth/getDate.
// In Docker (server TZ = UTC) but customer in CET/CEST, an order placed in
// the late evening UTC actually falls on the NEXT calendar day in
// Europe/Prague — the bucket reports the wrong day.
//
// Canonical fix: use Intl.DateTimeFormat with timeZone: 'Europe/Prague' and
// extract YYYY-MM-DD parts. The day shown should always be the customer's
// local CET day, regardless of server TZ.
//
// Spec assertion shape: navigate to /checkout?orderTime=<UTC ISO> for an
// order placed at 00:30 CEST (= 22:30 UTC the previous day), assert the
// loyalty-day element shows the CET calendar day.

import { test, expect } from "@playwright/test";

// Force the browser context to UTC to mirror the production deployment, where
// the docker container runs in UTC. Without this, a developer running tests on
// a CET machine would see the bug masked because the browser's local Date
// already returns the CET calendar day.
test.use({ timezoneId: "UTC" });

test.describe("INC-C: loyalty day must use Europe/Prague timezone", () => {
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
    // 2025-01-15 23:30:00 +01:00 (CET) = 2025-01-15 22:30:00 UTC.
    // Server-local Date in UTC reports 2025-01-15 (matches), so this case
    // is the OK side of the bug — but if a fix uses the wrong TZ (e.g.,
    // Europe/Warsaw or America/New_York) it would flip. Keeps regressions
    // honest.
    const orderIso = "2025-01-15T22:30:00Z";
    await page.goto(`/checkout?orderTime=${encodeURIComponent(orderIso)}`);

    await expect(page.locator('[data-testid="loyalty-day"]')).toContainText(
      "2025-01-15",
      { timeout: 5_000 },
    );
  });
});

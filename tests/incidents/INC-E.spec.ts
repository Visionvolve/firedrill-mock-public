// Phase 20 (D-09 incident E, D-13 validation flow):
// INC-E — "Cart total stale on remove"
//
// Symptom shown to participants:
//   "QA: Several customers complaining the cart total stays the same
//    after they remove items. Reproducible in Chrome."
//
// Root cause (hidden from participants): components/Cart.tsx subscribes to
// items but only recomputes subtotal when `items.length >= seen` — so a
// removal does not refresh the displayed subtotal.
//
// Canonical fix: drop the >= guard so the subtotal recomputes on every
// items change.
//
// This spec FAILS against the buggy seed and PASSES once the guard is
// removed. The post-receive validation worker (Plan 20-08) reads pass/fail
// from `--reporter=json` output via scripts/run-validation.ts.

import { test, expect } from "@playwright/test";
import { addProductToCart } from "../_helpers/fixtures";

test.describe("INC-E: cart total stale on remove", () => {
  // Each test starts with a fresh cart — clear localStorage on the origin
  // before navigating, so previous specs / re-runs don't bleed state in.
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL ?? "/");
    await page.evaluate(() => window.localStorage.clear());
  });

  test("subtotal updates when an item is removed", async ({ page }) => {
    // Add 2 distinct items.
    const price1 = await addProductToCart(page, "paralen-500-12tbl");
    const price2 = await addProductToCart(page, "ibalgin-400-12tbl");

    await page.goto("/cart");

    // Sanity: subtotal includes both prices to start.
    const sumBefore = price1 + price2;
    await expect(page.locator('[data-testid="cart-subtotal"]')).toContainText(
      String(sumBefore),
      { timeout: 5_000 },
    );

    // Remove the first cart line.
    await page
      .locator('[data-testid="cart-line"]')
      .first()
      .locator('button:has-text("Odstranit")')
      .click();

    // The subtotal MUST recompute. With INC-E present it stays stale.
    await expect(page.locator('[data-testid="cart-subtotal"]')).toContainText(
      String(price2),
      { timeout: 5_000 },
    );
    await expect(
      page.locator('[data-testid="cart-subtotal"]'),
    ).not.toContainText(String(sumBefore));
  });

  test("subtotal goes to 0 when all items are removed", async ({ page }) => {
    await addProductToCart(page, "paralen-500-12tbl");

    await page.goto("/cart");

    await page
      .locator('[data-testid="cart-line"]')
      .first()
      .locator('button:has-text("Odstranit")')
      .click();

    // Empty cart → subtotal must read 0 Kč.
    await expect(page.locator('[data-testid="cart-subtotal"]')).toContainText(
      "0 Kč",
      { timeout: 5_000 },
    );
  });
});

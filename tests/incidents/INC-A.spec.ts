// Phase 20-10 (D-09 incident A, D-13 validation flow):
// INC-A — "Currency rounding (PLN/CZK mismatch on multi-currency carts)"
//
// Symptom shown to participants:
//   "Customer reports their multi-item cart total is off by 1 CZK on every
//    order with mixed-currency items."
//
// Root cause (hidden from participants): lib/pricing.ts → `computeSubtotalMixed`
// rounds each line AFTER converting CZK→PLN. Per-line rounding errors
// accumulate, so a 5-item cart drifts ≥1 PLN from "sum-then-convert-then-round-once".
//
// Canonical fix: keep precision until the final subtotal, then round once.
//
// This spec FAILS against the buggy seed and PASSES once the fix is applied.

import { test, expect } from "@playwright/test";
import { addProductToCart, setDisplayCurrency } from "../_helpers/fixtures";

// Prices (CZK) of the 5 SKUs the test seeds. Kept in sync with products.json.
// At PLN rate 0.18 these convert to 10.62 / 8.82 / 4.14 / 3.06 / 16.02 PLN —
// the fractional residues all round DOWN under the buggy per-line policy, so
// the buggy sum drifts ≥1 below the correct answer.
const PRICES_CZK = [
  59,  // paralen-500-12tbl
  49,  // ibalgin-400-12tbl
  23,  // vitamin-c-1000-30tbl
  17,  // magnesium-b6-60tbl
  89,  // coldrex-12tbl
];

test.describe("INC-A: multi-currency cart rounding drift", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL ?? "/");
    await page.evaluate(() => {
      window.localStorage.clear();
    });
  });

  test("PLN subtotal matches sum-then-convert-then-round-once", async ({ page }) => {
    // Seed a 5-item mixed cart that produces drift under per-line rounding.
    await addProductToCart(page, "paralen-500-12tbl");
    await addProductToCart(page, "ibalgin-400-12tbl");
    await addProductToCart(page, "vitamin-c-1000-30tbl");
    await addProductToCart(page, "magnesium-b6-60tbl");
    await addProductToCart(page, "coldrex-12tbl");

    await page.goto("/cart");
    await setDisplayCurrency(page, "pln");

    // Read the rendered subtotal.
    const text = await page.locator('[data-testid="cart-subtotal"]').textContent();
    expect(text, "subtotal text missing").not.toBeNull();
    const m = text!.match(/(\d+)/);
    expect(m, `subtotal didn't contain a number: ${text}`).not.toBeNull();
    const renderedPln = Number.parseInt(m![1], 10);

    // Mathematically correct: sum CZK first, convert once, round once.
    const totalCzk = PRICES_CZK.reduce((a, b) => a + b, 0);
    const expectedPln = Math.round(totalCzk * 0.18);

    // The buggy seed rounds each line — the rendered total drifts strictly
    // below the correct answer for this cart. Spec asserts equality so it
    // FAILS under the bug and PASSES under the fix.
    expect(renderedPln).toBe(expectedPln);
  });
});

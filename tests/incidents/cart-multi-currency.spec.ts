
import { test, expect } from "@playwright/test";
import { addProductToCart, setDisplayCurrency } from "../_helpers/fixtures";

const PRICES_CZK = [
  59,  // paralen-500-12tbl
  49,  // ibalgin-400-12tbl
  23,  // vitamin-c-1000-30tbl
  17,  // magnesium-b6-60tbl
  89,  // coldrex-12tbl
];

test.describe("Cart subtotal stays consistent across mixed CZK/PLN currency display", () => {
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

    expect(renderedPln).toBe(expectedPln);
  });
});

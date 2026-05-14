
import { test, expect } from "@playwright/test";
import { addProductToCart } from "../_helpers/fixtures";

test.describe("Cart subtotal recomputes correctly on add, remove, and quantity change", () => {
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

// Phase 20 (D-09, D-13): Shared Playwright helpers for the firedrill incident specs.
//
// addProductToCart(page, slug) navigates to /health-medicine, clicks the
// "Přidat do košíku" button on the matching ProductCard, verifies the header
// cart count incremented, and returns the product's price_czk (read from the
// card's `data-price` attribute).
//
// Spec authors should NOT hardcode prices — let the helper return them so the
// fixture data and the assertion stay in sync if products.json prices change.

import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export async function addProductToCart(
  page: Page,
  productSlug: string,
): Promise<number> {
  await page.goto("/health-medicine", { waitUntil: "domcontentloaded" });
  // Wait for client JS to flush so the onClick handler attaches before we
  // dispatch the click. Without this, the button is server-rendered but the
  // React handler isn't attached yet → click is a no-op.
  await page.waitForLoadState("networkidle");

  const card = page.locator(
    `[data-testid="product-card"][data-product-slug="${productSlug}"]`,
  );
  await expect(card, `product card not found for slug ${productSlug}`).toBeVisible();

  const priceAttr = await card.getAttribute("data-price");
  if (!priceAttr) {
    throw new Error(`product card ${productSlug} has no data-price attribute`);
  }
  const price = Number.parseInt(priceAttr, 10);
  if (!Number.isFinite(price)) {
    throw new Error(`product card ${productSlug} has invalid data-price: ${priceAttr}`);
  }

  // Read cart contents BEFORE the click via localStorage. The header counter
  // is NOT a reliable indicator across navigations because each `useCart()`
  // hook instance owns its own React state and only syncs across components
  // through localStorage; the source of truth is the `firedrill_cart` key.
  const beforeQty = await readCartQty(page, productSlug);

  const addBtn = card.locator('[data-testid="add-to-cart"]');
  await addBtn.waitFor({ state: "visible" });
  await addBtn.click();

  // Poll localStorage for up to 5s — handles slow first-paint on cold dev
  // server. After this, /cart will pick up the items on its own mount.
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    const qty = await readCartQty(page, productSlug);
    if (qty > beforeQty) return price;
    await page.waitForTimeout(100);
  }
  throw new Error(
    `addProductToCart: cart quantity for ${productSlug} did not increase from ${beforeQty} after click`,
  );
}

async function readCartQty(page: Page, slug: string): Promise<number> {
  const json = await page.evaluate(
    () => window.localStorage.getItem("firedrill_cart") ?? "[]",
  );
  try {
    const items = JSON.parse(json) as Array<{ slug: string; qty: number }>;
    return items.find((it) => it.slug === slug)?.qty ?? 0;
  } catch {
    return 0;
  }
}

export async function setDisplayCurrency(
  page: Page,
  currency: "czk" | "pln",
): Promise<void> {
  await page.evaluate((c) => {
    window.localStorage.setItem("firedrill_display_currency", c);
    window.dispatchEvent(new CustomEvent("firedrill:currency-change", { detail: c }));
  }, currency);
}

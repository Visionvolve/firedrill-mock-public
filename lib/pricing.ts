import type { CartItem } from "./cart-store";
import productsData from "@/data/products.json";

export type DisplayCurrency = "czk" | "pln";

export const CURRENCY_RATES: Record<DisplayCurrency, number> = (() => {
  const c = (productsData as { currencies?: Record<string, number> }).currencies ?? {};
  return {
    czk: typeof c.czk === "number" ? c.czk : 1,
    pln: typeof c.pln === "number" ? c.pln : 0.18,
  };
})();

/**
 * Compute cart subtotal in whole CZK.
 *
 * Stable public signature — multiple downstream consumers depend on this
 * function existing as `computeSubtotal`.
 */
export function computeSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price_czk * item.qty, 0);
}

export function computeSubtotalMixed(
  items: CartItem[],
  displayCurrency: DisplayCurrency,
): number {
  return items.reduce((sum, item) => {
    const lineCzk = item.price_czk * item.qty;
    if (displayCurrency === "czk") return sum + Math.round(lineCzk);
    const linePln = Math.floor(lineCzk * CURRENCY_RATES.pln);
    return sum + linePln;
  }, 0);
}

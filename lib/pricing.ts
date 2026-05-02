import type { CartItem } from "./cart-store";
import productsData from "@/data/products.json";

export type DisplayCurrency = "czk" | "pln";

/**
 * Per-currency exchange rates against CZK base. Loaded from products.json so a
 * single fixture drives both product data and the currency table.
 *
 * Phase 20-10 (D-09 INC-A): the PLN rate (0.18) is intentionally chosen so
 * per-line rounding errors produce a reproducible drift on multi-item carts.
 */
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
 * Stable signature — INC-A (currency rounding) and INC-E (cart total stale on
 * remove) specs both rely on this function existing as `computeSubtotal`.
 */
export function computeSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price_czk * item.qty, 0);
}

/**
 * Multi-currency subtotal display.
 *
 * BUG INC-A (Phase 20-10, CONTEXT.md D-09): each line is converted from CZK to
 * the display currency and TRUNCATED to integer BEFORE accumulation. The
 * fractional residue (≤ 1 unit per line) is silently dropped on every line —
 * not rounded — so a multi-item cart drifts strictly BELOW the mathematically-
 * correct "sum-then-convert-then-round-once" answer. Customer impact: their
 * cart total is consistently off by 1+ unit on mixed-currency carts.
 *
 * The canonical fix (Plan 20-12 rehearsal): keep precision until the final
 * subtotal, then round once. e.g.
 *
 *   const totalInCzk = items.reduce((s, it) => s + it.price_czk * it.qty, 0);
 *   return Math.round(totalInCzk * CURRENCY_RATES[displayCurrency]);
 */
export function computeSubtotalMixed(
  items: CartItem[],
  displayCurrency: DisplayCurrency,
): number {
  return items.reduce((sum, item) => {
    const lineCzk = item.price_czk * item.qty;
    if (displayCurrency === "czk") return sum + Math.round(lineCzk);
    // BUG: truncate AFTER conversion per line — silently drops sub-unit
    // residue on every line, accumulating drift below the correct answer.
    const linePln = Math.floor(lineCzk * CURRENCY_RATES.pln);
    return sum + linePln;
  }, 0);
}

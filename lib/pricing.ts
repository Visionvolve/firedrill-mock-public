import type { CartItem } from "./cart-store";

/**
 * Compute cart subtotal in whole CZK.
 *
 * Stable signature — INC-A (currency rounding) and INC-E (cart total stale on
 * remove) specs both rely on this function existing as `computeSubtotal`.
 */
export function computeSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price_czk * item.qty, 0);
}

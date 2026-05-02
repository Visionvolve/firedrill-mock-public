"use client";

import { useCart, type Product } from "@/lib/cart-store";
import { useDisplayCurrency } from "./CurrencyToggle";
import { CURRENCY_RATES } from "@/lib/pricing";
import { DRMAX_BRAND } from "@/data/brand-tokens";

/**
 * Product detail page action surface — "add to cart" button + a localized
 * price hint. The PLN price shown here uses the same per-line round
 * function as cart subtotal computation, so a customer sees the same value on
 * the product page as they will on the cart subtotal line. (Both rely on the
 * INC-A buggy rounding policy.)
 */
export function ProductDetailActions({ product }: { product: Product }) {
  const { add } = useCart();
  const [currency] = useDisplayCurrency();

  const localizedPln = Math.round(product.price_czk * CURRENCY_RATES.pln);

  return (
    <>
      {currency === "pln" && (
        <p
          className="text-sm text-[#6B6B6B]"
          data-testid="detail-price-pln"
        >
          Přibližně {localizedPln} zł
        </p>
      )}
      <button
        type="button"
        onClick={() => add(product, 1)}
        className="mt-4 inline-block rounded-md px-6 py-3 text-base font-semibold text-white"
        style={{ backgroundColor: DRMAX_BRAND.red }}
        data-testid="detail-add-to-cart"
      >
        Přidat do košíku
      </button>
    </>
  );
}

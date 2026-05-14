"use client";

import { useCart, type Product } from "@/lib/cart-store";
import { useDisplayCurrency } from "./CurrencyToggle";
import { CURRENCY_RATES } from "@/lib/pricing";
import { DRMAX_BRAND } from "@/data/brand-tokens";

export function ProductDetailActions({ product }: { product: Product }) {
  const { add } = useCart();
  const [currency] = useDisplayCurrency();

  const localizedPln = Math.round(product.price_czk * CURRENCY_RATES.pln);

  return (
    <>
      {currency === "pln" && (
        <p
          className="text-sm text-[#5E5E5E]"
          data-testid="detail-price-pln"
        >
          Přibližně {localizedPln} zł
        </p>
      )}
      <div className="mt-4 flex items-stretch gap-2">
        {/* Quantity stepper — visual placeholder matches drmax.cz layout */}
        <div
          className="inline-flex items-stretch rounded border bg-white"
          style={{ borderColor: DRMAX_BRAND.border }}
        >
          <button
            type="button"
            aria-label="Snížit množství"
            className="px-3 text-lg text-[#5E5E5E] hover:bg-gray-50"
          >
            −
          </button>
          <span className="px-4 self-center font-bold tabular-nums">1</span>
          <button
            type="button"
            aria-label="Zvýšit množství"
            className="px-3 text-lg text-[#5E5E5E] hover:bg-gray-50"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => add(product, 1)}
          className="flex-1 rounded px-6 py-3 text-base font-bold text-white"
          style={{ backgroundColor: DRMAX_BRAND.greenSuccess }}
          data-testid="detail-add-to-cart"
        >
          Do košíku
        </button>
      </div>
      <p className="mt-3 text-xs text-[#5E5E5E] flex items-center gap-2">
        <span aria-hidden className="text-base">🚚</span>
        Doprava zdarma při nákupu nad 1&nbsp;500&nbsp;Kč. Limit pro přihlášené 499&nbsp;Kč.
      </p>
    </>
  );
}

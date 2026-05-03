"use client";

import Link from "next/link";
import { useCart, type Product } from "@/lib/cart-store";
import { DRMAX_BRAND } from "@/data/brand-tokens";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  // Loyalty/Dr.Max+ price (matches drmax.cz dual-price display)
  const loyaltyPrice = Math.max(1, Math.round(product.price_czk * 0.92));

  return (
    <article
      className="bg-white rounded-md border flex flex-col overflow-hidden hover:shadow-lg transition-shadow relative"
      style={{ borderColor: DRMAX_BRAND.border }}
      data-testid="product-card"
      data-product-id={product.id}
      data-product-slug={product.slug}
      data-price={product.price_czk}
    >
      {/* Sale badge in top-left (red corner ribbon) */}
      <div className="absolute top-2 left-2 z-10">
        <span
          className="inline-block px-2 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider rounded-sm"
          style={{ backgroundColor: DRMAX_BRAND.red }}
        >
          Sleva 8%
        </span>
      </div>

      <Link href={`/p/${product.slug}` as never} className="block">
        <div className="aspect-square w-full bg-white flex items-center justify-center p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            width={240}
            height={240}
            className="object-contain max-h-full max-w-full"
          />
        </div>
      </Link>
      <div className="flex-1 flex flex-col gap-2 px-4 pb-4">
        <p className="text-[11px] uppercase tracking-wider text-[#7A7A7A] font-semibold">
          {product.category}
        </p>
        <Link href={`/p/${product.slug}` as never}>
          <h3 className="text-sm font-bold text-[#1B1B1B] leading-tight hover:text-[#47850A] line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        <div className="flex-1" />

        {/* Price block — sale price big & red, loyalty price small & blue */}
        <div className="pt-2">
          <p
            className="text-2xl font-extrabold leading-none"
            style={{ color: DRMAX_BRAND.red }}
          >
            {product.price_czk}&nbsp;Kč
          </p>
          <p className="text-[11px] mt-1 flex items-center gap-1.5">
            <span
              className="inline-flex items-center justify-center px-1.5 rounded text-white font-extrabold text-[9px]"
              style={{ backgroundColor: DRMAX_BRAND.loyaltyBlue }}
            >
              Dr.Max+
            </span>
            <span className="font-bold" style={{ color: DRMAX_BRAND.loyaltyBlue }}>
              {loyaltyPrice}&nbsp;Kč
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => add(product, 1)}
          className="w-full rounded text-sm font-bold text-white py-2.5 mt-2 transition-colors"
          style={{ backgroundColor: DRMAX_BRAND.greenSuccess }}
          data-testid="add-to-cart"
          data-product-id={product.id}
        >
          Do košíku
        </button>
        <p className="text-[10px] text-[#5E5E5E] text-center">
          {product.in_stock ? "Skladem ve více než 100 lékárnách" : "Vyprodáno"}
        </p>
      </div>
    </article>
  );
}

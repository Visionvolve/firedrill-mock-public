"use client";

import { useCart, type Product } from "@/lib/cart-store";
import { DRMAX_BRAND } from "@/data/brand-tokens";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <article
      className="bg-white rounded-md border flex flex-col overflow-hidden"
      style={{ borderColor: DRMAX_BRAND.border }}
      data-testid="product-card"
      data-product-id={product.id}
      data-product-slug={product.slug}
      data-price={product.price_czk}
    >
      <div className="aspect-square w-full bg-[#F7F7F8] flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          className="object-contain"
        />
      </div>
      <div className="flex-1 flex flex-col gap-2 p-4">
        <p className="text-xs text-[#6B6B6B]">{product.category}</p>
        <h3 className="text-base font-bold text-[#1A1A1A] leading-tight">
          {product.name}
        </h3>
        <div className="flex-1" />
        <p className="text-lg font-extrabold" style={{ color: DRMAX_BRAND.red }}>
          {product.price_czk} Kč
        </p>
        <button
          type="button"
          onClick={() => add(product, 1)}
          className="w-full rounded-md py-2 text-sm font-semibold text-white transition-colors hover:opacity-95"
          style={{ backgroundColor: DRMAX_BRAND.red }}
          data-testid="add-to-cart"
          data-product-id={product.id}
        >
          Přidat do košíku
        </button>
      </div>
    </article>
  );
}

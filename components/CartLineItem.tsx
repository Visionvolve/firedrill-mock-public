"use client";

import type { CartItem } from "@/lib/cart-store";
import { useCart, type Product } from "@/lib/cart-store";
import { DRMAX_BRAND } from "@/data/brand-tokens";
import productsData from "@/data/products.json";

const allProducts = productsData.products as Product[];

type Props = {
  item: CartItem;
  onRemove?: () => void;
};

export function CartLineItem({ item, onRemove }: Props) {
  const { remove, setQty } = useCart();

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      remove(item.id);
    }
  };

  const linePrice = item.price_czk * item.qty;
  // Find image from products data (cart item may not carry it)
  const product = allProducts.find((p) => p.id === item.id);
  const image = product?.image;

  return (
    <li
      className="flex items-center gap-4 py-4 border-b"
      style={{ borderColor: DRMAX_BRAND.border }}
      data-testid="cart-line"
      data-item-id={item.id}
    >
      <div
        className="w-20 h-20 bg-white rounded shrink-0 flex items-center justify-center border p-1"
        style={{ borderColor: DRMAX_BRAND.border }}
      >
        {image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={image} alt={item.name} className="max-h-full max-w-full object-contain" />
        ) : (
          <span aria-hidden className="text-2xl">📦</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#1B1B1B] truncate">{item.name}</p>
        <p className="text-xs text-[#5E5E5E] mt-1">
          {item.price_czk} Kč / ks
        </p>
      </div>
      <input
        type="number"
        min={1}
        value={item.qty}
        onChange={(e) => setQty(item.id, Number(e.target.value) || 1)}
        aria-label="Počet kusů"
        className="w-16 rounded border px-2 py-1 text-sm text-center bg-white"
        style={{ borderColor: DRMAX_BRAND.border }}
        data-testid="line-qty"
      />
      <div
        className="w-24 text-right font-extrabold tabular-nums"
        style={{ color: DRMAX_BRAND.red }}
        data-testid="line-price"
      >
        {linePrice} Kč
      </div>
      <button
        type="button"
        onClick={handleRemove}
        className="text-sm text-[#5E5E5E] hover:text-[#E4002B] underline"
        data-testid="remove-line"
      >
        Odstranit
      </button>
    </li>
  );
}

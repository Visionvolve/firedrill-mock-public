"use client";

import type { CartItem } from "@/lib/cart-store";
import { useCart } from "@/lib/cart-store";
import { DRMAX_BRAND } from "@/data/brand-tokens";

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

  return (
    <li
      className="flex items-center gap-4 py-4 border-b"
      style={{ borderColor: DRMAX_BRAND.border }}
      data-testid="cart-line"
      data-item-id={item.id}
    >
      <div className="w-20 h-20 bg-[#F7F7F8] rounded shrink-0" aria-hidden />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#1A1A1A] truncate">{item.name}</p>
        <p className="text-xs text-[#6B6B6B] mt-1">
          {item.price_czk} Kč / ks
        </p>
      </div>
      <input
        type="number"
        min={1}
        value={item.qty}
        onChange={(e) => setQty(item.id, Number(e.target.value) || 1)}
        aria-label="Počet kusů"
        className="w-16 rounded-md border px-2 py-1 text-sm text-center"
        style={{ borderColor: DRMAX_BRAND.border }}
        data-testid="line-qty"
      />
      <div
        className="w-24 text-right font-bold"
        style={{ color: DRMAX_BRAND.red }}
        data-testid="line-price"
      >
        {linePrice} Kč
      </div>
      <button
        type="button"
        onClick={handleRemove}
        className="text-sm text-[#6B6B6B] hover:text-[#46B350] underline"
        data-testid="remove-line"
      >
        Odstranit
      </button>
    </li>
  );
}

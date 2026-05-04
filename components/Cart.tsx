"use client";
import type { CartItem } from "@/lib/cart-store";
import { useCart } from "@/lib/cart-store";
import { CartLineItem } from "./CartLineItem";
import { useEffect, useRef } from "react";

interface CartProps {
  /**
   * Notify the parent when the cart's line items change so the parent can
   * keep its own derived state (subtotal display, loyalty preview, etc.)
   * in sync with the canonical cart store.
   */
  onItemsChange?: (items: CartItem[]) => void;
}

export function Cart({ onItemsChange }: CartProps) {
  const { items, remove } = useCart();
  const prevCount = useRef(0);

  useEffect(() => {
    // Push the latest items up to the parent on add. Removals don't need to
    // be propagated here — the cart store handles the line disappearing on
    // its own and the parent will re-render via React's normal flow.
    if (items.length > prevCount.current) {
      onItemsChange?.(items);
    }
    prevCount.current = items.length;
  }, [items, onItemsChange]);

  return (
    <div>
      <ul data-testid="cart-lines">
        {items.map((item) => (
          <CartLineItem key={item.id} item={item} onRemove={() => remove(item.id)} />
        ))}
      </ul>
    </div>
  );
}

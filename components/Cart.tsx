"use client";
import { useCart } from "@/lib/cart-store";
import { CartLineItem } from "./CartLineItem";
import { computeSubtotal } from "@/lib/pricing";
import { useState, useEffect } from "react";

export function Cart() {
  const { items, remove } = useCart();
  // BUG INC-E: subtotal is captured into local state on mount and only
  // updated when items.length INCREASES. Removing an item leaves subtotal stale.
  const [subtotal, setSubtotal] = useState(0);
  const [seen, setSeen] = useState(0);
  useEffect(() => {
    if (items.length >= seen) {  // <-- the bug: only recompute when count grows
      setSubtotal(computeSubtotal(items));
      setSeen(items.length);
    }
  }, [items, seen]);

  return (
    <div>
      <ul data-testid="cart-lines">
        {items.map((item) => (
          <CartLineItem key={item.id} item={item} onRemove={() => remove(item.id)} />
        ))}
      </ul>
      <div data-testid="cart-subtotal">Mezisoučet: {subtotal} Kč</div>
    </div>
  );
}

"use client";
import { useCart } from "@/lib/cart-store";
import { CartLineItem } from "./CartLineItem";
import { computeSubtotal, computeSubtotalMixed } from "@/lib/pricing";
import { useDisplayCurrency } from "./CurrencyToggle";
import { useState, useEffect } from "react";

export function Cart() {
  const { items, remove } = useCart();
  const [currency] = useDisplayCurrency();
  // BUG INC-E: subtotal is captured into local state on mount and only
  // updated when items.length INCREASES. Removing an item leaves subtotal stale.
  const [subtotal, setSubtotal] = useState(0);
  const [seen, setSeen] = useState(0);
  useEffect(() => {
    if (items.length >= seen) {  // <-- the bug: only recompute when count grows
      setSubtotal(
        currency === "czk" ? computeSubtotal(items) : computeSubtotalMixed(items, currency),
      );
      setSeen(items.length);
    }
  }, [items, seen, currency]);

  const unit = currency === "czk" ? "Kč" : "zł";

  return (
    <div>
      <ul data-testid="cart-lines">
        {items.map((item) => (
          <CartLineItem key={item.id} item={item} onRemove={() => remove(item.id)} />
        ))}
      </ul>
      <div data-testid="cart-subtotal">Mezisoučet: {subtotal} {unit}</div>
    </div>
  );
}

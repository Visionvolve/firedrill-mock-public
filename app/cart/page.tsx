"use client";
import { useState } from "react";
import { Cart } from "@/components/Cart";
import { LoyaltyPanel } from "@/components/LoyaltyPanel";
import { useDisplayCurrency } from "@/components/CurrencyToggle";
import type { CartItem } from "@/lib/cart-store";
import { computeSubtotal, computeSubtotalMixed } from "@/lib/pricing";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currency] = useDisplayCurrency();
  const unit = currency === "czk" ? "Kč" : "zł";
  const subtotal =
    currency === "czk"
      ? computeSubtotal(cartItems)
      : computeSubtotalMixed(cartItems, currency);

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] mb-6">
        Váš košík
      </h1>
      <Cart onItemsChange={setCartItems} />
      <div
        data-testid="cart-subtotal"
        className="mt-6 text-xl font-bold text-[#1A1A1A]"
      >
        Mezisoučet: {subtotal} {unit}
      </div>
      <LoyaltyPanel cartSubtotal={subtotal} />
    </section>
  );
}

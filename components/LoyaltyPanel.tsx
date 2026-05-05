"use client";

import { useEffect, useState } from "react";
import { bucketLoyaltyDay } from "@/lib/loyalty";
import { DRMAX_BRAND } from "@/data/brand-tokens";

interface LoyaltyPanelProps {
  orderTimeIso?: string;
  cartSubtotal?: number;
}

export function LoyaltyPanel({ orderTimeIso, cartSubtotal }: LoyaltyPanelProps) {
  const [day, setDay] = useState<string>("");

  useEffect(() => {
    const orderDate = orderTimeIso ? new Date(orderTimeIso) : new Date();
    setDay(bucketLoyaltyDay(orderDate));
  }, [orderTimeIso]);

  const points =
    typeof cartSubtotal === "number" ? Math.floor(cartSubtotal / 100) : null;

  return (
    <div
      className="bg-white border rounded-md p-4"
      style={{ borderColor: DRMAX_BRAND.border }}
      data-testid="loyalty-panel"
    >
      <h2 className="font-bold mb-2">SubClub věrnostní program</h2>
      <p className="text-sm text-[#6B6B6B]">
        Body za tuto objednávku budou připsány k věrnostnímu dni{" "}
        <strong data-testid="loyalty-day">{day}</strong>.
      </p>
      {points !== null && (
        <p className="text-sm text-[#6B6B6B] mt-2">
          Získáte <strong data-testid="loyalty-points">{points}</strong> bodů
          za tento nákup.
        </p>
      )}
    </div>
  );
}

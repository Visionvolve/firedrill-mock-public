"use client";

import { useEffect, useState } from "react";
import { bucketLoyaltyDay } from "@/lib/loyalty";
import { DRMAX_BRAND } from "@/data/brand-tokens";

/**
 * SubClub loyalty preview at checkout.
 *
 * INC-C surface: shows which calendar day the order will be credited to under
 * Dr.MAX SubClub rules (must be Europe/Prague day). The buggy implementation
 * in `lib/loyalty.ts` uses server-local time which drifts across midnight CET
 * for orders within ±2h of midnight.
 *
 * The component accepts an `orderTimeIso` override so the Playwright spec can
 * inject a deterministic timestamp via `?orderTime=...` instead of relying on
 * the wall-clock at test time.
 */
export function LoyaltyPanel({ orderTimeIso }: { orderTimeIso?: string }) {
  const [day, setDay] = useState<string>("");

  useEffect(() => {
    const orderDate = orderTimeIso ? new Date(orderTimeIso) : new Date();
    setDay(bucketLoyaltyDay(orderDate));
  }, [orderTimeIso]);

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
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import type { DisplayCurrency } from "@/lib/pricing";
import { DRMAX_BRAND } from "@/data/brand-tokens";

const STORAGE_KEY = "firedrill_display_currency";

/**
 * Read the persisted display currency from localStorage. Defaults to "czk".
 * Module-level helper exposed so consumers (Cart, Checkout) can hydrate the
 * same way the toggle does without subscribing to the React state.
 */
export function readDisplayCurrency(): DisplayCurrency {
  if (typeof window === "undefined") return "czk";
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === "pln" ? "pln" : "czk";
  } catch {
    return "czk";
  }
}

/**
 * Hook the currency selection so cart/checkout components re-render when the
 * toggle flips without a page reload. Listens for both the synthetic
 * `firedrill:currency-change` event the toggle dispatches AND the native
 * `storage` event so cross-tab updates also propagate.
 */
export function useDisplayCurrency(): [
  DisplayCurrency,
  (next: DisplayCurrency) => void,
] {
  const [currency, setCurrency] = useState<DisplayCurrency>("czk");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCurrency(readDisplayCurrency());
    setHydrated(true);
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<DisplayCurrency>).detail;
      if (detail === "czk" || detail === "pln") setCurrency(detail);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "czk" || e.newValue === "pln")) {
        setCurrency(e.newValue);
      }
    };
    window.addEventListener("firedrill:currency-change", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("firedrill:currency-change", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const update = useCallback((next: DisplayCurrency) => {
    setCurrency(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage failure
    }
    window.dispatchEvent(
      new CustomEvent<DisplayCurrency>("firedrill:currency-change", {
        detail: next,
      }),
    );
  }, []);

  // Avoid SSR/CSR mismatch by returning the default until hydration completes.
  return [hydrated ? currency : "czk", update];
}

export function CurrencyToggle() {
  const [currency, setCurrency] = useDisplayCurrency();

  return (
    <div
      className="flex items-center gap-1 text-xs"
      data-testid="currency-toggle"
    >
      <span className="text-[#5E5E5E] mr-1">Měna:</span>
      <button
        type="button"
        onClick={() => setCurrency("czk")}
        className={
          "rounded px-2 py-0.5 font-semibold transition-colors " +
          (currency === "czk"
            ? "bg-[#47850A] text-white"
            : "bg-transparent text-[#5E5E5E] border border-[#DCDCDC] hover:border-[#47850A]")
        }
        data-testid="currency-toggle-czk"
        aria-pressed={currency === "czk"}
      >
        CZK
      </button>
      <button
        type="button"
        onClick={() => setCurrency("pln")}
        className={
          "rounded px-2 py-0.5 font-semibold transition-colors " +
          (currency === "pln"
            ? "bg-[#47850A] text-white"
            : "bg-transparent text-[#5E5E5E] border border-[#DCDCDC] hover:border-[#47850A]")
        }
        data-testid="currency-toggle-pln"
        aria-pressed={currency === "pln"}
      >
        PLN
      </button>
      {/* DRMAX_BRAND import retained for downstream styling consistency. */}
      <span className="sr-only" aria-hidden>{DRMAX_BRAND.greenDark}</span>
    </div>
  );
}

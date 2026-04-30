"use client";

import Link from "next/link";
import { DRMAX_BRAND } from "@/data/brand-tokens";
import { useCart } from "@/lib/cart-store";

export function SiteHeader() {
  const { items } = useCart();
  const cartCount = items.reduce((sum, it) => sum + it.qty, 0);

  return (
    <header className="w-full">
      {/* Top red bar — tagline left, cart count right */}
      <div
        className="text-white text-sm"
        style={{ backgroundColor: DRMAX_BRAND.red }}
      >
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          <span className="font-semibold">{DRMAX_BRAND.tagline}</span>
          <Link
            href="/cart"
            className="hover:underline flex items-center gap-2"
            data-testid="header-cart-link"
          >
            <span>Košík</span>
            <span
              className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-white text-xs font-bold"
              style={{ color: DRMAX_BRAND.red }}
              data-testid="header-cart-count"
            >
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* White nav row — logo, search, cart link */}
      <div
        className="bg-white border-b"
        style={{ borderColor: DRMAX_BRAND.border }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="shrink-0" aria-label="Dr.MAX home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={DRMAX_BRAND.logoPath}
              alt="Dr.MAX"
              width={120}
              height={40}
            />
          </Link>
          <div className="flex-1">
            <input
              type="search"
              placeholder="Hledat léky, vitamíny, kosmetiku…"
              aria-label="Vyhledávání produktů"
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: DRMAX_BRAND.border,
              }}
            />
          </div>
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <Link
              href="/health-medicine"
              className="text-[#1A1A1A] hover:text-[#E2001A] font-semibold"
            >
              Zdraví a léky
            </Link>
            <Link
              href="/cart"
              className="text-[#1A1A1A] hover:text-[#E2001A] font-semibold"
            >
              Košík ({cartCount})
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

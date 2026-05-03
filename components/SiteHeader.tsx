"use client";

import Link from "next/link";
import { DRMAX_BRAND } from "@/data/brand-tokens";
import { useCart } from "@/lib/cart-store";
import { CurrencyToggle } from "./CurrencyToggle";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SiteHeader() {
  const { items } = useCart();
  const cartCount = items.reduce((sum, it) => sum + it.qty, 0);
  const cartTotalCzk = items.reduce(
    (sum, it) => sum + it.price_czk * it.qty,
    0,
  );
  const router = useRouter();
  const [search, setSearch] = useState("");

  const onSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="w-full">
      {/* Top info banner — light blue with code/promo (matches drmax.cz) */}
      <div
        className="text-sm"
        style={{
          backgroundColor: DRMAX_BRAND.infoBg,
          color: "#0A4A7A",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center text-center gap-3">
          <span aria-hidden className="inline-block">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path
                d="M12 8v4M12 16h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span>
            Využijte kód <strong>WORKSHOP100</strong> pro slevu 100&nbsp;Kč při nákupu od 800&nbsp;Kč.
            Platí do 31.&nbsp;5.&nbsp;2026.
          </span>
        </div>
      </div>

      {/* Main header — white bg, logo + huge search pill + right-side icons */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 flex items-center"
            aria-label="Dr.Max — domovská stránka"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={DRMAX_BRAND.logoPath}
              alt="Dr.Max+"
              width={164}
              height={56}
              className="h-12 w-auto"
            />
          </Link>

          {/* Search — big pill input, dominant element of the header */}
          <div className="flex-1 max-w-3xl">
            <form onSubmit={onSubmitSearch} role="search" className="relative">
              <span
                className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5E5E5E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
              <input
                type="search"
                name="q"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Zadejte název produktu, značku nebo zdravotní problém"
                aria-label="Vyhledávání produktů"
                className="w-full rounded-full border bg-[#FBFBFB] pl-12 pr-5 py-3.5 text-sm text-[#1B1B1B] placeholder:text-[#7A7A7A] focus:outline-none focus:border-[#47850A] focus:ring-2 focus:ring-[#47850A]/20"
                style={{
                  borderColor: "rgba(0, 0, 0, 0.28)",
                  height: "52px",
                }}
                data-testid="site-search-input"
              />
            </form>
          </div>

          {/* Right cluster: phone + flag + heart + account + cart */}
          <div className="hidden lg:flex items-center gap-2 text-sm shrink-0">
            <a
              href="tel:+420516770100"
              className="flex items-center gap-2 px-2 text-[#0078BE] hover:underline"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="font-semibold">+420 516 770 100</span>
            </a>
            <span aria-hidden className="text-base px-1" title="Čeština">
              🇨🇿
            </span>
            {/* Heart icon (favorites) — green pill */}
            <button
              type="button"
              aria-label="Oblíbené produkty"
              className="w-11 h-11 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: DRMAX_BRAND.green }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 21s-7-4.5-9.5-9C.7 8.6 2 5 5.3 4.2c2-.5 4 .3 5.2 1.7L12 7.6l1.5-1.7c1.2-1.4 3.2-2.2 5.2-1.7C22 5 23.3 8.6 21.5 12 19 16.5 12 21 12 21z" />
              </svg>
            </button>
            {/* Account icon — green pill */}
            <button
              type="button"
              aria-label="Můj účet"
              className="w-11 h-11 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: DRMAX_BRAND.green }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-7 8-7s8 3 8 7" strokeLinecap="round" />
              </svg>
            </button>
            {/* Cart — outlined pill containing total + green basket */}
            <Link
              href="/cart"
              className="flex items-center gap-2 h-11 pl-4 pr-1 rounded-full border bg-white"
              style={{ borderColor: DRMAX_BRAND.border }}
              data-testid="header-cart-link"
            >
              <span className="font-bold text-[#1B1B1B] tabular-nums">
                {cartTotalCzk}&nbsp;Kč
              </span>
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center text-white relative"
                style={{ backgroundColor: DRMAX_BRAND.green }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M2 4h2.5l2 12h12l2-8H6.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                  <circle cx="9" cy="20" r="1.6" />
                  <circle cx="17" cy="20" r="1.6" />
                </svg>
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[10px] font-bold flex items-center justify-center border"
                    style={{ borderColor: DRMAX_BRAND.green, color: DRMAX_BRAND.green }}
                    data-testid="header-cart-count"
                  >
                    {cartCount}
                  </span>
                )}
              </span>
            </Link>
          </div>

          {/* Mobile cart fallback (hidden on lg+) */}
          <Link
            href="/cart"
            className="lg:hidden flex items-center gap-2 text-sm font-semibold text-[#1B1B1B]"
            data-testid="header-cart-link-mobile"
          >
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-white relative"
              style={{ backgroundColor: DRMAX_BRAND.green }}
            >
              🛒
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[10px] font-bold flex items-center justify-center border"
                  style={{ borderColor: DRMAX_BRAND.green, color: DRMAX_BRAND.green }}
                >
                  {cartCount}
                </span>
              )}
            </span>
          </Link>
        </div>
      </div>

      {/* Green category nav bar — primary horizontal navigation */}
      <nav
        className="text-white text-sm"
        style={{ backgroundColor: DRMAX_BRAND.greenDark }}
        aria-label="Hlavní kategorie"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <ul className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            <li>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-3 font-bold whitespace-nowrap hover:bg-black/10"
              >
                <span aria-hidden>☰</span>
                Procházet kategorie
              </button>
            </li>
            <li className="hidden sm:block w-px h-6 bg-white/30" aria-hidden />
            <li>
              <Link
                href="/health-medicine"
                className="block px-3 py-3 font-semibold whitespace-nowrap hover:bg-black/10"
              >
                Zdraví a léky
              </Link>
            </li>
            <li className="hidden md:block">
              <a
                href="#"
                className="block px-3 py-3 font-semibold whitespace-nowrap hover:bg-black/10"
              >
                Lékárny
              </a>
            </li>
            <li className="hidden md:block">
              <a
                href="#"
                className="block px-3 py-3 font-semibold whitespace-nowrap hover:bg-black/10"
              >
                E-recept
              </a>
            </li>
            <li className="hidden md:block">
              <a
                href="#"
                className="block px-3 py-3 font-semibold whitespace-nowrap hover:bg-black/10"
              >
                Ihned k odběru
              </a>
            </li>
            <li className="hidden lg:block">
              <a
                href="#"
                className="block px-3 py-3 font-semibold whitespace-nowrap hover:bg-black/10"
              >
                Prevence
              </a>
            </li>
            <li className="hidden lg:block">
              <a
                href="#"
                className="block px-3 py-3 font-semibold whitespace-nowrap hover:bg-black/10"
              >
                Poradna
              </a>
            </li>
          </ul>

          <div className="flex items-stretch shrink-0">
            <a
              href="#"
              className="hidden md:flex items-center gap-2 px-4 py-3 font-bold whitespace-nowrap text-white"
              style={{ backgroundColor: DRMAX_BRAND.red }}
            >
              <span aria-hidden>%</span>
              Akce a slevy
            </a>
          </div>
        </div>
      </nav>

      {/* Currency toggle moved to a discreet utility row below nav */}
      <div className="bg-white border-b" style={{ borderColor: DRMAX_BRAND.border }}>
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-end gap-3 text-xs text-[#5E5E5E]">
          <CurrencyToggle />
        </div>
      </div>
    </header>
  );
}

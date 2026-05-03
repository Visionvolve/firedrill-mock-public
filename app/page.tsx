import Link from "next/link";
import productsData from "@/data/products.json";
import type { Product } from "@/lib/cart-store";
import { ProductCard } from "@/components/ProductCard";
import { DRMAX_BRAND } from "@/data/brand-tokens";

const products = productsData.products as Product[];

const CATEGORY_TILES: Array<{ icon: string; label: string; href: string }> = [
  { icon: "💊", label: "Léky a doplňky", href: "/health-medicine" },
  { icon: "🌿", label: "Vitamíny a minerály", href: "/health-medicine" },
  { icon: "🤧", label: "Nachlazení a chřipka", href: "/health-medicine" },
  { icon: "💄", label: "Kosmetika a péče", href: "/health-medicine" },
  { icon: "👶", label: "Matka a dítě", href: "/health-medicine" },
  { icon: "🩺", label: "Zdravotnické přístroje", href: "/health-medicine" },
  { icon: "🐾", label: "Pro zvířata", href: "/health-medicine" },
  { icon: "🦷", label: "Dentální hygiena", href: "/health-medicine" },
];

export default function HomePage() {
  const topProducts = products.slice(0, 6);

  return (
    <>
      {/* Hero promo banner */}
      <section className="max-w-7xl mx-auto px-4 pt-6">
        <div
          className="rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 items-center"
          style={{
            background:
              "linear-gradient(135deg, #FBE6E6 0%, #F9D6D2 60%, #F2BFB8 100%)",
          }}
        >
          <div className="p-8 sm:p-12">
            <p className="text-sm font-extrabold uppercase tracking-wider text-[#AF0023] mb-3">
              MEGA SLEVY
            </p>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight text-[#1B1B1B]">
              Výhodné nabídky <br />
              na stovky produktů
            </h1>
            <p className="mt-4 text-base text-[#5E5E5E] max-w-md">
              Šetřete s Dr.Max+ — věrnostní program, který se vyplatí. Nakupte chytře a využijte slevy až do 40&nbsp;%.
            </p>
            <Link
              href="/health-medicine"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded text-sm font-bold text-white"
              style={{ backgroundColor: DRMAX_BRAND.greenSuccess }}
            >
              ZOBRAZIT NABÍDKY
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="hidden md:flex justify-center items-center p-6">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/products/vichy-serum.png"
                alt="Akční produkt"
                className="h-64 w-auto object-contain drop-shadow-xl"
              />
              <div
                className="absolute -top-2 -right-2 w-24 h-24 rounded-full flex flex-col items-center justify-center text-white font-extrabold text-2xl shadow-lg"
                style={{ backgroundColor: DRMAX_BRAND.red }}
              >
                <span className="text-xs leading-none">AŽ</span>
                <span className="leading-none">-15%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-extrabold mb-5 text-[#1B1B1B]">
          Procházet kategorie
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORY_TILES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href as never}
              className="bg-white rounded-md border p-4 text-center hover:border-[#47850A] hover:shadow-md transition-all"
              style={{ borderColor: DRMAX_BRAND.border }}
            >
              <div className="text-3xl mb-2" aria-hidden>
                {cat.icon}
              </div>
              <p className="text-xs font-bold text-[#1B1B1B] leading-tight">
                {cat.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top produkty */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-xl font-extrabold text-[#1B1B1B]">Top produkty</h2>
          <Link
            href="/health-medicine"
            className="text-sm font-bold text-[#47850A] hover:underline"
          >
            Zobrazit vše →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {topProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promo strip */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div
          className="rounded-lg p-6 sm:p-8 text-white grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
          style={{ backgroundColor: DRMAX_BRAND.greenDark }}
        >
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-wider font-bold opacity-80 mb-1">
              Sleva 100 Kč
            </p>
            <p className="text-2xl font-extrabold">
              Použijte kód <span className="bg-white text-[#1B1B1B] px-2 py-0.5 rounded">WORKSHOP100</span> v košíku.
            </p>
            <p className="mt-2 text-sm opacity-90">
              Při nákupu nad 800 Kč. Akce platí do 31. 5. 2026.
            </p>
          </div>
          <div className="text-right">
            <Link
              href="/health-medicine"
              className="inline-block px-5 py-3 bg-white text-[#47850A] font-bold rounded text-sm"
            >
              Začít nakupovat
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

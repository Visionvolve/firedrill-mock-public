import Link from "next/link";
import { DRMAX_BRAND } from "@/data/brand-tokens";

export default function HomePage() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center">
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1A1A1A]">
        {DRMAX_BRAND.siteName}
      </h1>
      <p className="mt-4 text-lg sm:text-xl text-[#6B6B6B]">
        {DRMAX_BRAND.tagline} — vaše online lékárna.
      </p>
      <div className="mt-10">
        <Link
          href="/health-medicine"
          className="inline-block rounded-md px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors"
          style={{ backgroundColor: DRMAX_BRAND.red }}
        >
          Procházet zdraví a léky
        </Link>
      </div>
    </section>
  );
}

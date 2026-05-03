import productsData from "@/data/products.json";
import type { Product } from "@/lib/cart-store";
import { ProductDetailActions } from "@/components/ProductDetailActions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DRMAX_BRAND } from "@/data/brand-tokens";

const allProducts = productsData.products as Product[];

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = allProducts.find((p) => p.slug === slug);
  if (!product) notFound();

  const loyaltyPrice = Math.max(1, Math.round(product.price_czk * 0.92));
  const oldPrice = Math.round(product.price_czk / 0.92);

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#5E5E5E] mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">Úvod</Link>
        {" / "}
        <Link href="/health-medicine" className="hover:underline">Zdraví a léky</Link>
        {" / "}
        <span className="text-[#1B1B1B]">{product.name}</span>
      </nav>

      <div
        className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 bg-white rounded-md border p-6"
        style={{ borderColor: DRMAX_BRAND.border }}
        data-testid="product-detail"
        data-product-slug={product.slug}
        data-price={product.price_czk}
      >
        {/* Image */}
        <div className="aspect-square w-full bg-white rounded-md flex items-center justify-center p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="object-contain max-h-full"
          />
        </div>

        {/* Info column */}
        <div className="flex flex-col gap-4">
          <p className="text-[11px] uppercase tracking-wider text-[#7A7A7A] font-semibold">
            {product.category}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B] leading-tight">
            {product.name}
          </h1>
          <p className="text-sm text-[#5E5E5E]">
            Kvalitní produkt z lékárny Dr.Max — ověřeno farmaceuty,
            skladem ve více než 460 lékárnách v ČR. Ideální volba pro vaše každodenní zdraví.
          </p>

          <div className="border-t border-b py-4 mt-2" style={{ borderColor: DRMAX_BRAND.border }}>
            <p className="text-xs text-[#5E5E5E] flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: DRMAX_BRAND.greenSuccess }}
                aria-hidden
              />
              <span className="font-bold text-[#1B1B1B]">Skladem na e-shopu</span>
              <span>K vyzvednutí v lékárně do 24 hodin</span>
            </p>
          </div>

          <div>
            <p className="text-xs text-[#7A7A7A]">Aktuální cena</p>
            <div className="flex items-baseline gap-3 mt-1">
              <p
                className="text-4xl font-black tabular-nums"
                style={{ color: DRMAX_BRAND.red }}
                data-testid="detail-price-czk"
              >
                {product.price_czk}&nbsp;Kč
              </p>
              <p className="text-sm text-[#7A7A7A] line-through">
                {oldPrice}&nbsp;Kč
              </p>
              <span
                className="px-1.5 py-0.5 rounded text-white text-xs font-extrabold"
                style={{ backgroundColor: DRMAX_BRAND.red }}
              >
                -8%
              </span>
            </div>
            <p className="mt-2 text-sm flex items-center gap-2">
              <span
                className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-white font-extrabold text-[10px]"
                style={{ backgroundColor: DRMAX_BRAND.loyaltyBlue }}
              >
                Dr.Max+
              </span>
              <span className="font-bold" style={{ color: DRMAX_BRAND.loyaltyBlue }}>
                {loyaltyPrice}&nbsp;Kč pro členy věrnostního programu
              </span>
            </p>
          </div>

          <ProductDetailActions product={product} />
        </div>
      </div>
    </section>
  );
}

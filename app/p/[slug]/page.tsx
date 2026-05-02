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

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <p className="text-sm text-[#6B6B6B]">
        <Link href="/" className="hover:underline">
          Úvod
        </Link>{" "}
        /{" "}
        <Link href="/health-medicine" className="hover:underline">
          Zdraví a léky
        </Link>{" "}
        / {product.name}
      </p>
      <div
        className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6"
        data-testid="product-detail"
        data-product-slug={product.slug}
        data-price={product.price_czk}
      >
        <div
          className="aspect-square w-full bg-white rounded-md border flex items-center justify-center"
          style={{ borderColor: DRMAX_BRAND.border }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xs text-[#6B6B6B]">{product.category}</p>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A]">{product.name}</h1>
          <p
            className="text-2xl font-extrabold"
            style={{ color: DRMAX_BRAND.red }}
            data-testid="detail-price-czk"
          >
            {product.price_czk} Kč
          </p>
          <ProductDetailActions product={product} />
        </div>
      </div>
    </section>
  );
}

import productsData from "@/data/products.json";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/cart-store";

const products = productsData.products as Product[];

export default function HealthMedicinePage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-6">
        <p className="text-sm text-[#6B6B6B]">
          <a href="/" className="hover:underline">
            Úvod
          </a>{" "}
          / Zdraví a léky
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
          Zdraví a léky
        </h1>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          {products.length} produktů — léky, vitamíny, kosmetika a péče.
        </p>
      </header>
      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6"
        data-testid="product-grid"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

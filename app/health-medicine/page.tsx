import productsData from "@/data/products.json";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/cart-store";

const products = productsData.products as Product[];

export default function HealthMedicinePage() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <nav className="text-xs text-[#5E5E5E] mb-3" aria-label="Breadcrumb">
        <a href="/" className="hover:underline">Úvod</a>
        {" / "}
        <span className="text-[#1B1B1B]">Zdraví a léky</span>
      </nav>
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B1B1B]">
          Zdraví a léky
        </h1>
        <p className="mt-2 text-sm text-[#5E5E5E]">
          {products.length} produktů — léky, vitamíny, kosmetika a péče. Vyberte z naší kompletní nabídky.
        </p>
      </header>
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        data-testid="product-grid"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

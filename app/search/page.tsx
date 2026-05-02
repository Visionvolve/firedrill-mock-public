import productsData from "@/data/products.json";
import type { Product } from "@/lib/cart-store";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

const allProducts = productsData.products as Product[];

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Search results page. Performs the same matching as /api/search but inline
 * (server-side render) so the page itself doesn't trigger the INC-B latency
 * spike — the bug surfaces only via the autocomplete-style XHR path.
 *
 * INC-B spec hits /api/search directly so it can time the API regardless of
 * whether the page calls the API or matches inline.
 */
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const q = (typeof sp.q === "string" ? sp.q : "").trim();
  const results: Product[] = q
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.category.toLowerCase().includes(q.toLowerCase()),
      )
    : [];

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-6">
        <p className="text-sm text-[#6B6B6B]">
          <Link href="/" className="hover:underline">
            Úvod
          </Link>{" "}
          / Vyhledávání
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#1A1A1A]">
          Výsledky vyhledávání
        </h1>
        {q ? (
          <p className="mt-2 text-sm text-[#6B6B6B]">
            Hledaný výraz: <strong>{q}</strong> — {results.length} výsledků.
          </p>
        ) : (
          <p className="mt-2 text-sm text-[#6B6B6B]">
            Zadejte hledaný výraz do políčka v záhlaví.
          </p>
        )}
      </header>
      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6"
        data-testid="search-results"
      >
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

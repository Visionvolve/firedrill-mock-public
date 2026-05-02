import { Cart } from "@/components/Cart";
import { LoyaltyPanel } from "@/components/LoyaltyPanel";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const orderTime = typeof sp.orderTime === "string" ? sp.orderTime : undefined;

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] mb-6">
        Pokladna
      </h1>
      <p className="text-sm text-[#6B6B6B] mb-6">
        Zkontrolujte svou objednávku před dokončením nákupu.
      </p>

      <div
        className="bg-white border rounded-md p-4 mb-6"
        style={{ borderColor: "#E5E5E5" }}
        data-testid="checkout-cart"
      >
        <h2 className="font-bold mb-3">Vaše položky</h2>
        <Cart />
      </div>

      <LoyaltyPanel orderTimeIso={orderTime} />

      <button
        type="button"
        className="mt-6 rounded-md px-6 py-3 text-base font-semibold text-white"
        style={{ backgroundColor: "#E2001A" }}
        data-testid="place-order"
      >
        Dokončit objednávku
      </button>
    </section>
  );
}

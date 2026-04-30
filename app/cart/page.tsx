import { Cart } from "@/components/Cart";

export default function CartPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] mb-6">
        Váš košík
      </h1>
      <Cart />
    </section>
  );
}

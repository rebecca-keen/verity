import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/data";

export const metadata = {
  title: "Product Reviews — Verity",
  description: "Clean-beauty product reviews linked to med spas that use them.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-gold">Clean beauty</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">Product reviews</h1>
      <p className="mt-3 max-w-2xl text-stone">
        See clean scores, ingredients, and which Miami med spas use each product — before you book.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}

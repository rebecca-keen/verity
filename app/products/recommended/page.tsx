export const metadata = {
  title: "Recommended Products — Verity",
  description:
    "Derm-recommended luxury skincare from Caudalie, EltaMD, iS Clinical, SkinMedica, La Roche-Posay, ISDIN, ALASTIN, and SkinCeuticals — shop on Amazon with verified reviews.",
};

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getRecommendedProductsByBrand } from "@/lib/recommended-products";

export default function RecommendedProductsPage() {
  const brandGroups = getRecommendedProductsByBrand();
  const total = brandGroups.reduce((n, g) => n + g.products.length, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-gold">Shop</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">Recommended products</h1>
      <p className="mt-3 max-w-2xl text-stone">
        Luxury derm-brand skincare curated for post-procedure care, daily SPF, and clinical anti-aging
        — the same categories verified med spas list on Verity.
      </p>
      <p className="mt-2 text-sm text-stone/80">
        As an Amazon Associate, Verity earns from qualifying purchases. Prices and availability on
        Amazon may vary.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/products"
          className="rounded-full border border-stone/20 px-4 py-1.5 text-xs uppercase tracking-wider text-stone transition hover:border-gold/40 hover:text-charcoal"
        >
          All product reviews
        </Link>
      </div>

      <p className="mt-4 text-sm text-stone">
        {total} recommended product{total !== 1 ? "s" : ""} · {brandGroups.length} brands
      </p>

      <div className="mt-10 space-y-14">
        {brandGroups.map(({ brand, products: brandProducts }) => (
          <section key={brand}>
            <h2 className="font-serif text-2xl text-charcoal">{brand}</h2>
            <p className="mt-1 text-sm text-stone">
              {brandProducts.length} product{brandProducts.length !== 1 ? "s" : ""} · Shop on Amazon
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {brandProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

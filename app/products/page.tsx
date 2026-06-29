export const metadata = {
  title: "Product Reviews — Verity",
  description: "Verified product reviews linked to providers that use them.",
};

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { originLabels, products } from "@/lib/data";
import type { ProductOrigin } from "@/lib/types";

const originFilters: { value: ProductOrigin | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "US", label: "American" },
  { value: "KR", label: "Korean" },
  { value: "FR", label: "French" },
  { value: "IT", label: "Italian" },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ origin?: string }>;
}) {
  const { origin } = await searchParams;
  const activeOrigin =
    origin && origin in originLabels ? (origin as ProductOrigin) : undefined;
  const filtered = activeOrigin
    ? products.filter((p) => p.origin === activeOrigin)
    : products;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-gold">Products</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">Product reviews</h1>
      <p className="mt-3 max-w-2xl text-stone">
        Trust scores, ingredients, and which Miami providers use each product — from American
        clinical staples to Korean, French, and Italian luxury skincare.
      </p>
      <p className="mt-2 text-sm text-stone/80">
        Purchases through Verity shop links may earn a commission that supports independent reviews.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {originFilters.map(({ value, label }) => {
          const isActive = value === "all" ? !activeOrigin : activeOrigin === value;
          const href = value === "all" ? "/products" : `/products?origin=${value}`;
          return (
            <Link
              key={value}
              href={href}
              className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-wider transition ${
                isActive
                  ? "bg-charcoal text-ivory"
                  : "border border-stone/20 text-stone hover:border-gold/40 hover:text-charcoal"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-stone">
        {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        {activeOrigin ? ` · ${originLabels[activeOrigin]}` : ""}
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { originLabels } from "@/lib/data";
import { shopPageMetadata } from "@/lib/seo";
import {
  filterShopProductsByOrigin,
  getRecommendedShopProducts,
  getShopProducts,
  getShopProductsByOrigin,
} from "@/lib/shop-utils";
import type { ProductOrigin } from "@/lib/types";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ origin?: string }>;
}): Promise<import("next").Metadata> {
  const { origin } = await searchParams;
  return shopPageMetadata(origin);
}

const originFilters: { value: ProductOrigin | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "US", label: "American" },
  { value: "KR", label: "Korean" },
  { value: "FR", label: "French" },
  { value: "IT", label: "Italian" },
];

/** Short editorial blurb per region for the shop section headers. */
const originBlurbs: Record<ProductOrigin, string> = {
  US: "Clinical derm-brand skincare favored by med spas for post-procedure care.",
  KR: "K-beauty essences, toners, and sunscreens for glass-skin hydration.",
  FR: "French-pharmacy classics for sensitive skin and barrier repair.",
  IT: "Italian anti-aging skincare with peptides and hyaluronic acid.",
  EU: "European pharmacy-grade formulations for gentle, effective care.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ origin?: string }>;
}) {
  const { origin } = await searchParams;
  const activeOrigin =
    origin && origin in originLabels ? (origin as ProductOrigin) : undefined;

  const recommended = filterShopProductsByOrigin(getRecommendedShopProducts(), activeOrigin);
  const allShop = filterShopProductsByOrigin(getShopProducts(), activeOrigin);
  const originGroups = getShopProductsByOrigin(allShop);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-gold">Shop</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">Skincare for skin concerns</h1>
      <p className="mt-3 max-w-2xl text-stone">
        Derm-recommended skincare curated for post-procedure care, daily SPF, acne, and anti-aging —
        the same product categories listed med spas and medical aesthetics clinics reference on Verity.
      </p>
      <p className="mt-2 text-sm text-stone/80">
        As an Amazon Associate, Verity earns from qualifying purchases. Prices and availability on
        Amazon may vary.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {originFilters.map(({ value, label }) => {
          const isActive = value === "all" ? !activeOrigin : activeOrigin === value;
          const href =
            value === "all" ? "/shop" : `/shop?origin=${value}`;
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
        {allShop.length} product{allShop.length !== 1 ? "s" : ""}
        {activeOrigin ? ` · ${originLabels[activeOrigin]}` : ""}
      </p>

      {recommended.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-2xl text-charcoal">Recommended</h2>
          <p className="mt-1 text-sm text-stone">
            {recommended.length} editor pick{recommended.length !== 1 ? "s" : ""} · Shop on Amazon
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((p) => (
              <ProductCard key={p.slug} product={p} showAmazonProminently />
            ))}
          </div>
        </section>
      )}

      <div className="mt-14 space-y-14">
        {originGroups.map(({ origin: groupOrigin, products: originProducts }) => (
          <section key={groupOrigin}>
            <h2 className="font-serif text-2xl text-charcoal">
              {originLabels[groupOrigin]} skincare
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-stone">{originBlurbs[groupOrigin]}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-gold">
              {originProducts.length} product{originProducts.length !== 1 ? "s" : ""} · Shop on Amazon
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {originProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {allShop.length === 0 && (
        <p className="mt-10 text-stone">
          No products match this filter.{" "}
          <Link href="/shop" className="text-gold hover:underline">
            View all shop products
          </Link>
        </p>
      )}

      <p className="mt-14 text-center text-xs text-stone/80">
        Purchases through Verity shop links may earn a commission that supports independent reviews.
      </p>
    </div>
  );
}

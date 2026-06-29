import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SpaCard } from "@/components/SpaCard";
import { ReviewCard } from "@/components/ReviewCard";
import { getProductReviews, getSpasForProduct, originLabels } from "@/lib/data";
import { getProductAffiliateUrl, getAmazonShopLabel } from "@/lib/affiliate";
import { getShopProduct, getShopProducts } from "@/lib/shop-utils";
import type { ProductOrigin } from "@/lib/types";

const originStories: Record<ProductOrigin, string> = {
  US: "American clinical skincare brands favored by board-certified providers for post-procedure recovery and evidence-based results.",
  KR: "Korean beauty innovation — layered hydration, gentle actives, and sunscreen culture refined over decades of aesthetic research.",
  FR: "French pharmacy and salon heritage — from dermatologist-founded SPF to cult facial-room treatments like Biologique Recherche.",
  IT: "Italian spa-house formulations blending Mediterranean botanicals with sensorial luxury for wellness-forward facial experiences.",
  EU: "European skincare traditions emphasizing gentle efficacy and pharmacy-grade formulation standards.",
};

export function generateStaticParams() {
  return getShopProducts().map((p) => ({ slug: p.slug }));
}

export default async function ShopProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getShopProduct(slug);
  if (!product) notFound();

  const productReviews = getProductReviews(slug);
  const linkedSpas = getSpasForProduct(slug);
  const shopUrl = getProductAffiliateUrl(product.affiliateUrl, product.affiliatePartner);
  const shopLabel = product.affiliatePartner
    ? getAmazonShopLabel(product.affiliatePartner)
    : `Shop ${product.brand}`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
          <Image src={product.image} alt={product.name} fill className="object-contain p-6" sizes="50vw" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {product.origin && (
              <span className="rounded-full bg-charcoal/80 px-3 py-1 text-xs uppercase tracking-wider text-ivory backdrop-blur-sm">
                {originLabels[product.origin]}
              </span>
            )}
            {product.premium && (
              <span className="rounded-full bg-gold/90 px-3 py-1 text-xs uppercase tracking-wider text-charcoal backdrop-blur-sm">
                Premium
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-stone">{product.brand}</p>
          <h1 className="mt-2 font-serif text-4xl text-charcoal">{product.name}</h1>
          <p className="mt-2 text-stone">{product.category}</p>
          <div className="mt-6 flex gap-8">
            <div>
              <p className="text-xs text-stone">Trust Score</p>
              <p className="text-3xl font-semibold text-sage">{product.trustScore}/100</p>
            </div>
            <div>
              <p className="text-xs text-stone">Rating</p>
              <p className="text-3xl text-gold">★ {product.rating}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.productTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-sage/10 px-3 py-1 text-xs capitalize text-sage"
              >
                {tag.replace("-", " ")}
              </span>
            ))}
          </div>
          <p className="mt-6 leading-relaxed text-stone">{product.description}</p>
          {product.origin && (
            <div className="mt-6 rounded-xl bg-cream p-4">
              <p className="text-sm font-medium text-charcoal">
                {originLabels[product.origin]} skincare
              </p>
              <p className="mt-1 text-sm leading-relaxed text-stone">
                {originStories[product.origin]}
              </p>
            </div>
          )}
          <div className="mt-6">
            <p className="text-sm font-medium text-charcoal">Key ingredients</p>
            <p className="mt-1 text-sm text-stone">{product.ingredients.join(" · ")}</p>
          </div>
          {shopUrl && (
            <div className="mt-8">
              <a
                href={shopUrl}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="inline-block rounded-full bg-charcoal px-8 py-3 text-sm font-medium tracking-wider text-ivory transition hover:bg-charcoal/90"
              >
                {shopLabel}
              </a>
              {product.affiliatePartner && (
                <p className="mt-2 text-xs text-stone">
                  via {product.affiliatePartner} · Verity may earn a commission at no extra cost to
                  you
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-serif text-2xl text-charcoal">
          Verified providers that use this ({linkedSpas.length})
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {linkedSpas.map((spa) => (
            <SpaCard key={spa.slug} spa={spa} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl text-charcoal">Reviews</h2>
        <div className="mt-4 space-y-4">
          {productReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </section>

      <div className="mt-10 flex flex-wrap justify-center gap-6 text-center">
        <Link href="/shop" className="text-gold hover:underline">
          ← Back to shop
        </Link>
        <Link href="/concierge" className="text-gold hover:underline">
          Ask AI which product fits your goals →
        </Link>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { RemoteImage } from "@/components/RemoteImage";
import { ContactLink } from "@/components/ContactLink";
import { DirectContactPanel } from "@/components/DirectContactPanel";
import { ProductCard } from "@/components/ProductCard";
import { ReviewCard } from "@/components/ReviewCard";
import { SpaGallery } from "@/components/SpaGallery";
import { SpaSocialLinks } from "@/components/SpaSocialLinks";
import { TreatmentCategories } from "@/components/TreatmentCategories";
import { ProviderTypeBadge } from "@/components/ProviderTypeBadge";
import { TrustBadge, TrustPanel } from "@/components/TrustBadge";
import { getSpa, getProductsForSpa, getSpaReviews, spas } from "@/lib/data";
import { formatGoogleRating } from "@/lib/spa-display";
import { contactFormUrl } from "@/lib/constants";
import {
  breadcrumbJsonLd,
  localBusinessJsonLd,
  providerPageMetadata,
  providerReviewsJsonLd,
  TREATMENT_CATEGORY_SEO,
} from "@/lib/seo";

export function generateStaticParams() {
  return spas.map((spa) => ({ slug: spa.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const spa = getSpa(slug);
  if (!spa) return { title: "Provider — Verity" };

  return providerPageMetadata(spa);
}

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const spa = getSpa(slug);
  if (!spa) notFound();

  const spaProducts = getProductsForSpa(slug);
  const spaReviews = getSpaReviews(slug);
  const googleRating = formatGoogleRating(spa);
  const reviewsJsonLd = providerReviewsJsonLd(spa, spaReviews);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <JsonLd
        data={[
          localBusinessJsonLd(spa),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Providers", path: "/providers" },
            { name: spa.name, path: `/providers/${spa.slug}` },
          ]),
          ...(reviewsJsonLd ? [reviewsJsonLd] : []),
        ]}
      />
      <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
        <RemoteImage
          src={spa.image}
          alt={`${spa.name} — ${spa.providerType.replace("-", " ")} in ${spa.city}, ${spa.state}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      <p className="mt-2 text-xs text-stone">Photo source: {spa.imageSource}</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrustBadge listingStatus={spa.listingStatus} premierPartner={spa.premierPartner} />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <ProviderTypeBadge type={spa.providerType} />
          </div>
          <div className="mt-3 flex items-center gap-4">
            {spa.logo && (
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-stone/10 bg-cream p-1">
                <RemoteImage
                  src={spa.logo}
                  alt={`${spa.name} logo`}
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
            )}
            <h1 className="font-serif text-4xl text-charcoal">{spa.name}</h1>
          </div>
          <p className="text-stone">
            {spa.neighborhood}, {spa.city} · {spa.priceRange}
            {googleRating ? ` · ${googleRating}` : ` · ★ ${spa.rating}`}
            {googleRating && spa.reviewCount > 0 ? ` (${spa.reviewCount} Google reviews)` : null}
          </p>
          <div className="mt-3">
            <TreatmentCategories categories={spa.treatmentCategories} />
          </div>
          <p className="mt-2 font-serif text-xl text-stone">{spa.tagline}</p>

          <div className="mt-6">
            <SpaSocialLinks spa={spa} prominent />
          </div>

          <p className="mt-6 leading-relaxed text-stone">{spa.description}</p>

          <div className="mt-10">
            <SpaGallery spa={spa} />
          </div>

          <div className="mt-10">
            <h2 className="font-serif text-2xl text-charcoal">Products we use</h2>
            <p className="mt-1 text-sm text-stone">
              Retail products commonly used in similar treatments — shop on Amazon when available.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {spaProducts.map((p) => (
                <ProductCard key={p.slug} product={p} showAmazonProminently />
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-serif text-2xl text-charcoal">Reviews</h2>
            {googleRating && (
              <p className="mt-1 text-sm text-stone">
                {googleRating}
                {spa.reviewCount > 0 ? ` · ${spa.reviewCount} public Google reviews` : ""}
              </p>
            )}
            <div className="mt-4 space-y-4">
              {spaReviews.length > 0 ? (
                spaReviews.map((r) => <ReviewCard key={r.id} review={r} />)
              ) : (
                <p className="text-sm text-stone">
                  No Verity reviews yet.
                  {googleRating ? ` See ${googleRating} on Google.` : ""}
                </p>
              )}
            </div>
            <p className="mt-4 text-sm text-stone">
              Visited this practice?{" "}
              <Link
                href={contactFormUrl({
                  subject: `Review: ${spa.name}`,
                  topic: "Leave a review",
                  spa: spa.name,
                })}
                className="text-gold hover:underline"
              >
                Share your experience
              </Link>
              {" "}— we publish verified visit reviews after editorial review.
            </p>
          </div>

          <div className="mt-10">
            <h2 className="font-serif text-2xl text-charcoal">Browse similar providers</h2>
            <p className="mt-2 text-sm text-stone">
              More med spas and aesthetics clinics in {spa.city}, {spa.state} and by treatment type.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/providers?state=${spa.state}&city=${encodeURIComponent(spa.city)}`}
                className="rounded-full border border-stone/20 px-3 py-1.5 text-xs text-charcoal transition hover:border-gold"
              >
                More in {spa.city}, {spa.state}
              </Link>
              <Link
                href={`/providers?state=${spa.state}`}
                className="rounded-full border border-stone/20 px-3 py-1.5 text-xs text-charcoal transition hover:border-gold"
              >
                All in {spa.state}
              </Link>
              {spa.treatmentCategories.map((category) => (
                <Link
                  key={category}
                  href={`/providers?category=${category}&state=${spa.state}`}
                  className="rounded-full border border-stone/20 px-3 py-1.5 text-xs text-charcoal transition hover:border-gold"
                >
                  {TREATMENT_CATEGORY_SEO[category].h1} in {spa.state}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <TrustPanel spa={spa} />
          <DirectContactPanel spa={spa} />
          <div className="luxury-border rounded-2xl bg-cream p-5 text-sm text-stone">
            <p className="font-medium text-charcoal">Is this your practice?</p>
            <p className="mt-2">
              Claim or update this listing — contact us with your practice name and website.
            </p>
            <Link
              href={contactFormUrl({
                subject: `Claim listing: ${spa.name}`,
                topic: "Claim a listing",
                spa: spa.name,
              })}
              className="mt-4 inline-block text-gold hover:underline"
            >
              Claim listing →
            </Link>
          </div>
          <div className="luxury-border rounded-2xl bg-cream p-5 text-sm text-stone">
            <p className="font-medium text-charcoal">Treatments</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {spa.treatments.map((t) => (
                <span key={t} className="rounded-full bg-white px-3 py-1 text-xs capitalize">
                  {t.replace("-", " ")}
                </span>
              ))}
            </div>
            <Link href="/concierge" className="mt-4 inline-block text-gold hover:underline">
              Not sure? Ask AI Concierge →
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-8 rounded-xl border border-stone/10 bg-cream/50 p-4 text-xs leading-relaxed text-stone">
        Verity lists publicly sourced information for research purposes. We do not provide medical
        advice, guarantee outcomes, or confirm state licenses. Always verify credentials with the
        practice and your state medical board before treatment.
      </p>

      <p className="mt-6 border-t border-stone/10 pt-8 text-center text-xs text-stone">
        Listing incorrect?{" "}
        <ContactLink subject={`Listing correction: ${spa.name}`} topic="Listing correction" spa={spa.name}>
          Report a correction
        </ContactLink>
      </p>
    </div>
  );
}

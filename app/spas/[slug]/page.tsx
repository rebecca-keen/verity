import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BookingForm } from "@/components/BookingForm";
import { InstagramFeed } from "@/components/InstagramFeed";
import { ProductCard } from "@/components/ProductCard";
import { ReviewCard } from "@/components/ReviewCard";
import { TrustBadge, TrustPanel } from "@/components/TrustBadge";
import { getSpa, getProductsForSpa, getSpaReviews, spas } from "@/lib/data";

export function generateStaticParams() {
  return spas.map((spa) => ({ slug: spa.slug }));
}

export default async function SpaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const spa = getSpa(slug);
  if (!spa) notFound();

  const spaProducts = getProductsForSpa(slug);
  const spaReviews = getSpaReviews(slug);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
        <Image src={spa.image} alt={spa.name} fill className="object-cover" priority sizes="100vw" />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrustBadge verified={spa.verified} cleanPartner={spa.cleanPartner} />
          <h1 className="mt-4 font-serif text-4xl text-charcoal">{spa.name}</h1>
          <p className="text-stone">
            {spa.neighborhood}, {spa.city} · {spa.priceRange} · ★ {spa.rating} ({spa.reviewCount})
          </p>
          <p className="mt-2 font-serif text-xl text-stone">{spa.tagline}</p>
          <p className="mt-4 leading-relaxed text-stone">{spa.description}</p>

          <div className="mt-10">
            <h2 className="font-serif text-2xl text-charcoal">Gallery</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
              {spa.gallery.map((src) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={src} alt="" fill className="object-cover" sizes="300px" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <InstagramFeed handle={spa.instagram} />
          </div>

          <div className="mt-10">
            <h2 className="font-serif text-2xl text-charcoal">Products we use</h2>
            <p className="mt-1 text-sm text-stone">
              Linked to clean-beauty reviews — a gap RealSelf and Yelp don&apos;t fill.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {spaProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-serif text-2xl text-charcoal">Reviews</h2>
            <div className="mt-4 space-y-4">
              {spaReviews.length > 0 ? (
                spaReviews.map((r) => <ReviewCard key={r.id} review={r} />)
              ) : (
                <p className="text-sm text-stone">No reviews yet. Be the first after your visit.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <TrustPanel spa={spa} />
          <BookingForm spaSlug={spa.slug} spaName={spa.name} />
          <div className="luxury-border rounded-2xl bg-cream p-5 text-sm text-stone">
            <p className="font-medium text-charcoal">Treatments</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {spa.treatments.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white px-3 py-1 text-xs capitalize"
                >
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
    </div>
  );
}

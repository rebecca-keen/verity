import Link from "next/link";
import { ContactLink } from "@/components/ContactLink";
import { JsonLd } from "@/components/JsonLd";
import { SpaCard } from "@/components/SpaCard";
import { ProductCard } from "@/components/ProductCard";
import { AIConcierge } from "@/components/AIConcierge";
import { getFeaturedPremiumSpasFromData } from "@/lib/data";
import { getRecommendedShopProducts } from "@/lib/shop-utils";
import { homeFaqJsonLd, pageMetadata, SITE_KEYWORDS, TREATMENT_CATEGORY_SEO } from "@/lib/seo";
import { TREATMENT_BROWSE_ORDER } from "@/lib/spa-utils";

export const metadata = pageMetadata({
  title: "Verity — Medical Aesthetics, Skincare & Med Spas Nationwide",
  description:
    "Find trusted med spas and medical aesthetics clinics for injectables, laser treatments, facials, and skincare. Compare providers by skin concerns, ratings, and product transparency.",
  path: "/",
  keywords: SITE_KEYWORDS,
});

export default function HomePage() {
  const featured = getFeaturedPremiumSpasFromData(8);
  const shopProducts = getRecommendedShopProducts().slice(0, 6);

  return (
    <>
      <JsonLd data={homeFaqJsonLd()} />
      <section className="border-b border-stone/10 bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">United States · Medical aesthetics &amp; skincare</p>
          <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl leading-tight text-charcoal md:text-6xl">
            Trusted med spas for injectables, lasers &amp; skincare
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone">
            Find curated med spas, medical aesthetics clinics, and dermatology practices across the United States.
            Research injectables, laser treatments, facials, and skincare for your skin concerns — with product
            transparency, medical director info where publicly listed, and AI matching.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/concierge"
              className="rounded-full bg-charcoal px-8 py-3 text-sm font-medium tracking-wider text-ivory"
            >
              AI Concierge
            </Link>
            <Link
              href="/providers"
              className="rounded-full border border-charcoal px-8 py-3 text-sm font-medium tracking-wider text-charcoal"
            >
              Browse Providers
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs uppercase tracking-widest text-gold">Who it&apos;s for</p>
        <h2 className="mt-2 font-serif text-3xl text-charcoal">Built for trust-first buyers and practices</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="luxury-border rounded-2xl bg-white p-8">
            <p className="text-xs uppercase tracking-widest text-gold">For consumers</p>
            <h3 className="mt-2 font-serif text-xl text-charcoal">Research with confidence</h3>
            <p className="mt-3 text-sm leading-relaxed text-stone">
              Whether you&apos;re comparing Botox and fillers, booking a laser series, or choosing your
              first facial or body contouring treatment — Verity helps luxury-minded buyers find
              listed providers with transparent products, publicly listed medical director info, and public
              review ratings.
            </p>
            <Link href="/concierge" className="mt-4 inline-block text-sm text-gold hover:underline">
              Try AI Concierge →
            </Link>
          </div>
          <div className="luxury-border rounded-2xl bg-cream p-8">
            <p className="text-xs uppercase tracking-widest text-gold">For providers</p>
            <h3 className="mt-2 font-serif text-xl text-charcoal">Grow your practice</h3>
            <p className="mt-3 text-sm leading-relaxed text-stone">
              Aesthetics clinics, med spas, and dermatology practices use Verity for curated listings,
              direct contact links, and optional featured placement — free listings today, with top
              visibility for practices who want to stand out in their city.
            </p>
            <Link href="/for-spas" className="mt-4 inline-block text-sm text-gold hover:underline">
              Partner with Verity →
            </Link>
            <p className="mt-3 text-xs text-stone">
              Questions about listing?{" "}
              <ContactLink subject="List my practice on Verity" topic="List my practice">
                Contact us
              </ContactLink>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs uppercase tracking-widest text-gold">Browse by treatment</p>
        <h2 className="mt-2 font-serif text-3xl text-charcoal">Medical aesthetics &amp; beauty providers</h2>
        <p className="mt-3 max-w-2xl text-sm text-stone">
          Filter our nationwide directory by treatment type — from injectables and laser treatments to facials
          and body contouring.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {TREATMENT_BROWSE_ORDER.map((key) => {
            const seo = TREATMENT_CATEGORY_SEO[key];
            return (
              <Link
                key={key}
                href={seo.path}
                className="luxury-border rounded-2xl bg-white p-6 transition hover:border-gold/40"
              >
                <h3 className="font-serif text-lg text-charcoal">{seo.h1}</h3>
                <p className="mt-2 text-sm text-stone">{seo.intro}</p>
                <span className="mt-4 inline-block text-sm text-gold">Browse providers →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs uppercase tracking-widest text-gold">Skin concerns</p>
        <h2 className="mt-2 font-serif text-3xl text-charcoal">Research treatments for your goals</h2>
        <p className="mt-3 max-w-2xl text-sm text-stone">
          Whether you&apos;re addressing acne, fine lines, pigmentation, or hair removal — start with the
          treatment category that matches your skin concern, then compare providers by location and ratings.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Injectables & anti-aging",
              desc: "Botox, dermal fillers, and wrinkle-smoothing treatments at med spas and aesthetics clinics.",
              href: TREATMENT_CATEGORY_SEO.injectables.path,
            },
            {
              title: "Laser treatments",
              desc: "Laser hair removal, resurfacing, IPL, and pigmentation correction from listed providers.",
              href: TREATMENT_CATEGORY_SEO.lasers.path,
            },
            {
              title: "Skincare & facials",
              desc: "Chemical peels, microneedling, and facial treatments for acne, texture, and maintenance.",
              href: TREATMENT_CATEGORY_SEO.beauty.path,
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="luxury-border rounded-2xl bg-white p-6 transition hover:border-gold/40"
            >
              <h3 className="font-serif text-lg text-charcoal">{item.title}</h3>
              <p className="mt-2 text-sm text-stone">{item.desc}</p>
              <span className="mt-4 inline-block text-sm text-gold">Browse providers →</span>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-sm text-stone">
          <Link href="/providers" className="text-gold hover:underline">
            View all providers
          </Link>
          {" · "}
          <Link href="/shop" className="text-gold hover:underline">
            Shop skincare
          </Link>
        </p>
      </section>

      <section className="border-y border-stone/10 bg-cream py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Sourced trust",
                desc: "License lookup links, medical director info where listed, and honest sourcing — not just star ratings.",
              },
              {
                title: "Product transparency",
                desc: "See exactly what products providers use. Shop editor-picked skincare for common skin concerns.",
              },
              {
                title: "AI concierge",
                desc: "Describe your goals — injectables, lasers, or skincare. Get matched to the right med spa in seconds.",
              },
            ].map((item) => (
              <div key={item.title} className="luxury-border rounded-2xl bg-white p-6">
                <h3 className="font-serif text-xl text-charcoal">{item.title}</h3>
                <p className="mt-2 text-sm text-stone">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">For providers</p>
              <h2 className="mt-2 font-serif text-2xl text-charcoal">Get featured nationwide</h2>
              <p className="mt-3 max-w-2xl text-sm text-stone">
                Free listed profiles today. Featured placement available for practices who want top
                visibility in their city.
              </p>
            </div>
            <Link href="/for-spas" className="text-sm text-gold hover:underline">
              List your practice →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Listed profile",
                price: "Free",
                desc: "Get listed, show treatments, socials, and contact links",
              },
              {
                title: "Featured in your city",
                price: "Contact us",
                desc: "Top of search in your city — limited spots per neighborhood",
              },
              {
                title: "Update your profile",
                price: "Contact us",
                desc: "Questions about listing or featured placement? Reach out anytime.",
              },
            ].map((item) => (
              <div key={item.title} className="luxury-border rounded-xl bg-white p-5">
                <p className="font-medium text-charcoal">{item.title}</p>
                <p className="mt-1 text-lg text-gold">
                  {item.title === "Update your profile" ? (
                    <ContactLink subject="Update my Verity profile" topic="Update my profile">
                      Contact us
                    </ContactLink>
                  ) : item.title === "Featured in your city" ? (
                    <ContactLink subject="Featured placement inquiry" topic="Featured placement">
                      Contact us
                    </ContactLink>
                  ) : (
                    item.price
                  )}
                </p>
                <p className="mt-1 text-xs text-stone">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16 text-ivory">
        <div className="mx-auto max-w-6xl px-6">
          <AIConcierge />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">Highly rated</p>
            <h2 className="mt-2 font-serif text-3xl text-charcoal">Featured listed providers</h2>
          </div>
          <Link href="/providers" className="text-sm text-gold hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featured.map((spa) => (
            <SpaCard key={spa.slug} spa={spa} />
          ))}
        </div>
      </section>

      <section className="border-t border-stone/10 bg-cream py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">Shop</p>
              <h2 className="mt-2 font-serif text-3xl text-charcoal">Skincare for skin concerns</h2>
            </div>
            <Link href="/shop" className="text-sm text-gold hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shopProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

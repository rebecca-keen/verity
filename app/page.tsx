import Link from "next/link";
import { ContactEmail } from "@/components/ContactEmail";
import { SpaCard } from "@/components/SpaCard";
import { ProductCard } from "@/components/ProductCard";
import { AIConcierge } from "@/components/AIConcierge";
import { getFeaturedPremiumSpasFromData } from "@/lib/data";
import { getRecommendedShopProducts } from "@/lib/shop-utils";

export default function HomePage() {
  const featured = getFeaturedPremiumSpasFromData(8);
  const shopProducts = getRecommendedShopProducts().slice(0, 6);

  return (
    <>
      <section className="border-b border-stone/10 bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">United States · Verified providers</p>
          <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl leading-tight text-charcoal md:text-6xl">
            Trusted aesthetics &amp; med spas, verified
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone">
            Find verified aesthetics clinics, med spas, and dermatology practices across the United States.
            Research injectables, lasers, facials, and body contouring with product transparency, medical
            director info, and AI matching — starting with curated listings in top metros nationwide.
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
              verified providers with transparent products, medical director credentials, and real
              reviews.
            </p>
            <Link href="/concierge" className="mt-4 inline-block text-sm text-gold hover:underline">
              Try AI Concierge →
            </Link>
          </div>
          <div className="luxury-border rounded-2xl bg-cream p-8">
            <p className="text-xs uppercase tracking-widest text-gold">For providers</p>
            <h3 className="mt-2 font-serif text-xl text-charcoal">Grow your practice</h3>
            <p className="mt-3 text-sm leading-relaxed text-stone">
              Aesthetics clinics, med spas, and dermatology practices use Verity for verified profiles,
              direct contact links, and optional featured placement — free listings today, with top
              visibility for practices who want to stand out in their city.
            </p>
            <Link href="/for-spas" className="mt-4 inline-block text-sm text-gold hover:underline">
              Partner with Verity →
            </Link>
            <p className="mt-3 text-xs text-stone">
              Questions about listing? <ContactEmail subject="List my practice on Verity" />
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-stone/10 bg-cream py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Verified trust",
                desc: "License, medical director, and standards — not just star ratings.",
              },
              {
                title: "Product transparency",
                desc: "See exactly what products providers use. Read verified product reviews.",
              },
              {
                title: "AI concierge",
                desc: "Describe your goals. Get matched to the right aesthetics clinic or med spa in seconds.",
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
                Free verified listings today. Featured placement available for practices who want top
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
                title: "Verified listing",
                price: "Free",
                desc: "Get verified, show treatments, socials, and contact links",
              },
              {
                title: "Featured in your city",
                price: "Contact us",
                desc: "Top of search in your city — limited spots per neighborhood",
              },
              {
                title: "Update your profile",
                price: "Email us",
                desc: "Questions about listing or featured placement? Reach out anytime.",
              },
            ].map((item) => (
              <div key={item.title} className="luxury-border rounded-xl bg-white p-5">
                <p className="font-medium text-charcoal">{item.title}</p>
                <p className="mt-1 text-lg text-gold">
                  {item.title === "Update your profile" ? (
                    <ContactEmail subject="Update my Verity profile" />
                  ) : item.title === "Featured in your city" ? (
                    <ContactEmail subject="Featured placement inquiry" />
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
            <h2 className="mt-2 font-serif text-3xl text-charcoal">Featured verified providers</h2>
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
              <h2 className="mt-2 font-serif text-3xl text-charcoal">Recommended skincare</h2>
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

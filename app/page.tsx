import Link from "next/link";
import { SpaCard } from "@/components/SpaCard";
import { ProductCard } from "@/components/ProductCard";
import { AIConcierge } from "@/components/AIConcierge";
import { spas, products } from "@/lib/data";

export default function HomePage() {
  const featured = spas.filter((s) => s.premierPartner).slice(0, 8);

  return (
    <>
      <section className="border-b border-stone/10 bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Miami · Nationwide Next</p>
          <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl leading-tight text-charcoal md:text-6xl">
            Trusted med spas, verified
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone">
            {spas.length} verified med spas across Greater Miami. Reputable providers, product
            transparency, verified reviews, and AI matching — in one luxury destination.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/concierge"
              className="rounded-full bg-charcoal px-8 py-3 text-sm font-medium tracking-wider text-ivory"
            >
              AI Concierge
            </Link>
            <Link
              href="/spas"
              className="rounded-full border border-charcoal px-8 py-3 text-sm font-medium tracking-wider text-charcoal"
            >
              Browse {spas.length} Miami Spas
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Verified trust",
              desc: "License, medical director, and standards — not just star ratings.",
            },
            {
              title: "Product transparency",
              desc: "See exactly what products spas use. Read verified product reviews.",
            },
            {
              title: "AI concierge",
              desc: "Describe your goals. Get matched to the right spa in seconds.",
            },
          ].map((item) => (
            <div key={item.title} className="luxury-border rounded-2xl bg-white p-6">
              <h3 className="font-serif text-xl text-charcoal">{item.title}</h3>
              <p className="mt-2 text-sm text-stone">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-stone/10 bg-cream py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">Monetization</p>
              <h2 className="mt-2 font-serif text-2xl text-charcoal">How Verity makes money</h2>
            </div>
            <Link href="/premium" className="text-sm text-gold hover:underline">
              Verity Premium →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Spa subscriptions", price: "$149–299/mo", desc: "Partner & Premium listings" },
              { title: "Verity Premium", price: "$12/mo", desc: "Consumer priority booking & AI" },
              { title: "Booking fees", price: "3–5%", desc: "Commission on completed bookings" },
              { title: "Featured placement", price: "$500+/mo", desc: "Top-of-search visibility" },
            ].map((item) => (
              <div key={item.title} className="luxury-border rounded-xl bg-white p-5">
                <p className="font-medium text-charcoal">{item.title}</p>
                <p className="mt-1 text-lg text-gold">{item.price}</p>
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
            <p className="text-xs uppercase tracking-widest text-gold">Premier Partners</p>
            <h2 className="mt-2 font-serif text-3xl text-charcoal">Featured Miami med spas</h2>
          </div>
          <Link href="/spas" className="text-sm text-gold hover:underline">
            View all {spas.length} →
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
              <p className="text-xs uppercase tracking-widest text-gold">Products</p>
              <h2 className="mt-2 font-serif text-3xl text-charcoal">Product reviews</h2>
            </div>
            <Link href="/products" className="text-sm text-gold hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

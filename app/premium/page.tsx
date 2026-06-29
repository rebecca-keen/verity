import Link from "next/link";
import { ContactEmail } from "@/components/ContactEmail";
import { spas } from "@/lib/data";

export const metadata = {
  title: "Verity Premium — For Consumers",
  description: "Priority booking, AI concierge, saved providers, and exclusive nationwide aesthetics access.",
};

export default function PremiumPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-gold">For consumers</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">Verity Premium</h1>
      <p className="mt-4 text-lg text-stone">
        Skip the research. Get priority access to the best verified aesthetics clinics, med spas, and
        dermatology practices nationwide.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="luxury-border rounded-2xl bg-white p-8">
          <p className="text-xs uppercase tracking-widest text-stone">Free</p>
          <p className="mt-2 font-serif text-3xl text-charcoal">$0</p>
          <ul className="mt-6 space-y-3 text-sm text-stone">
            <li>✓ Browse all {spas.length} verified providers nationwide</li>
            <li>✓ Read reviews & product info</li>
            <li>✓ Contact providers directly (call, website, Instagram)</li>
            <li>✓ Basic AI Concierge</li>
          </ul>
        </div>

        <div className="luxury-border rounded-2xl border-gold/30 bg-cream p-8">
          <p className="text-xs uppercase tracking-widest text-gold">Premium</p>
          <p className="mt-2 font-serif text-3xl text-charcoal">
            $12<span className="text-base text-stone">/mo</span>
          </p>
          <ul className="mt-6 space-y-3 text-sm text-stone">
            <li>✓ Priority booking — providers see you first</li>
            <li>✓ Unlimited AI Concierge sessions</li>
            <li>✓ Save favorite providers & products</li>
            <li>✓ Price alerts & new provider notifications</li>
            <li>✓ Trust Score deep dives on products</li>
            <li>✓ Early access to new listings in your city</li>
          </ul>
          <button
            type="button"
            className="mt-8 w-full rounded-full bg-charcoal py-3 text-sm font-medium tracking-wider text-ivory"
          >
            Join Premium — Coming Soon
          </button>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-serif text-2xl text-charcoal">How Verity makes money</h2>
        <p className="mt-2 text-stone">
          Verity earns from both sides — providers and consumers — so the platform stays independent and
          trust-first.
        </p>
        <div className="mt-8 space-y-4">
          {[
            {
              title: "Provider subscriptions",
              amount: "$149–299/month per practice",
              desc: "Partner & Premium listings, booking tools, Instagram sync, analytics.",
            },
            {
              title: "Verity Premium",
              amount: "$12/month per consumer",
              desc: "Priority booking, unlimited AI, saved providers, alerts.",
            },
            {
              title: "Booking commission",
              amount: "3–5% per completed booking",
              desc: "Small fee when a booking through Verity converts to a paid visit.",
            },
            {
              title: "Featured placement",
              amount: "$500–2,000/month",
              desc: "Top-of-search and homepage featured spots for paid partner listings.",
            },
            {
              title: "Lead generation",
              amount: "$25–75 per qualified lead",
              desc: "Providers pay for high-intent booking requests in competitive neighborhoods.",
            },
            {
              title: "Product affiliate",
              amount: "5–15% commission",
              desc: "When consumers buy premium skincare through Verity shop links — revenue supports independent reviews.",
            },
          ].map((item) => (
            <div key={item.title} className="luxury-border rounded-xl bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-medium text-charcoal">{item.title}</p>
                <p className="text-sm font-medium text-gold">{item.amount}</p>
              </div>
              <p className="mt-2 text-sm text-stone">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 luxury-border rounded-2xl bg-cream p-8 text-center">
        <h2 className="font-serif text-xl text-charcoal">Questions about Premium?</h2>
        <p className="mt-2 text-sm text-stone">
          Launch timing, features, or provider partner programs — we&apos;re happy to help.
        </p>
        <p className="mt-4 text-sm text-stone">
          <ContactEmail subject="Verity Premium inquiry">Email us →</ContactEmail>
        </p>
      </section>

      <p className="mt-10 text-center text-sm text-stone">
        <Link href="/for-spas" className="text-gold hover:underline">
          Provider owner? See partner pricing →
        </Link>
      </p>
    </div>
  );
}

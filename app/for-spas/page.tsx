import Link from "next/link";
import { ContactLink } from "@/components/ContactLink";
import { contactFormUrl } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "For Providers — Verity",
  description:
    "List your aesthetics clinic, med spa, or dermatology practice on Verity. Verified profiles, featured placement, and lead generation.",
  path: "/for-spas",
});

const providerTiers = [
  {
    tier: "Listed",
    price: "Free",
    note: "Current status for all directory listings today",
    features: ["Basic profile", "Social links", "Direct contact (phone, website, Instagram)"],
  },
  {
    tier: "Verified Partner",
    price: "$149–199/mo",
    note: "Paid tier — not active for current free listings",
    features: [
      "Verified badge subscription",
      "Review responses",
      "Product tagging",
      "Instagram feed on profile",
      "Analytics snapshot",
    ],
  },
  {
    tier: "Featured Premium",
    price: "$299–499/mo",
    note: "Paid tier — limited spots per neighborhood",
    features: [
      "Top-of-neighborhood search",
      "Homepage featured rotation",
      "Unlimited gallery & video",
      "Multi-provider profiles",
      "AI lead insights",
    ],
  },
  {
    tier: "Featured placement",
    price: "$500+/mo",
    note: "À la carte top placement — waitlist open",
    features: [
      "Category sponsor (injectables, laser, etc.)",
      "Concierge match priority",
      "Newsletter feature slot",
    ],
  },
];

const addOns = [
  { title: "Lead referrals", price: "$25–75 / inquiry", desc: "Pay per qualified booking inquiry routed to your team." },
  { title: "Profile enhancement", price: "Custom", desc: "Professional photos, treatment video, retail product links." },
  { title: "Analytics dashboard", price: "$99/mo add-on", desc: "Profile views, click-through, neighborhood benchmarks." },
  { title: "Booking commission", price: "3–5%", desc: "If integrated later — only on completed bookings through Verity." },
];

export default function ForSpasPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-gold">B2B · Aesthetics clinics & med spas</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">
        Partner with Verity — aesthetics clinics & med spas
      </h1>
      <p className="mt-4 text-lg text-stone">
        Verity is built for aesthetics clinics and med spas first — plus dermatology practices with
        aesthetic services. Reach high-intent clients researching injectables, lasers, facials,
        and body contouring who care about reputation, medical oversight, and product transparency.
      </p>

      <p className="mt-6 rounded-xl border border-stone/15 bg-cream p-4 text-sm text-stone">
        Listings on Verity are sourced from public records and practice websites. A &quot;Listed&quot; badge
        does not confirm state licensure — providers are responsible for accurate credentials. Verity
        does not provide medical advice or guarantee patient outcomes.
      </p>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-charcoal">Who it&apos;s for</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Aesthetics clinics",
              desc: "Board-supervised injectables, laser suites, and treatment rooms — showcase credentials and product menus.",
            },
            {
              title: "Med spas",
              desc: "Full-service facial, body, and wellness menus with verified medical director info and direct contact links.",
            },
            {
              title: "Dermatology practices",
              desc: "Aesthetic dermatology and laser-focused practices seeking trust-first discovery and qualified leads.",
            },
          ].map((item) => (
            <div key={item.title} className="luxury-border rounded-xl bg-cream p-5">
              <h3 className="font-medium text-charcoal">{item.title}</h3>
              <p className="mt-2 text-sm text-stone">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl text-charcoal">What you get</h2>
        <p className="mt-2 text-sm text-stone">
          Every provider on the directory today has a <strong>free listed</strong> profile. Optional
          tiers below add visibility and tools when you&apos;re ready — they are not active for current
          listings.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {providerTiers.map((plan) => (
            <div key={plan.tier} className="luxury-border rounded-2xl bg-white p-6">
              <h3 className="font-serif text-xl text-charcoal">{plan.tier}</h3>
              <p className="mt-2 text-2xl text-gold">{plan.price}</p>
              <p className="mt-1 text-xs text-stone">{plan.note}</p>
              <ul className="mt-4 space-y-2 text-sm text-stone">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-gold">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl text-charcoal">Optional add-ons</h2>
        <div className="mt-6 space-y-3">
          {addOns.map((item) => (
            <div key={item.title} className="luxury-border rounded-xl bg-cream p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-medium text-charcoal">{item.title}</p>
                <p className="text-sm font-medium text-gold">{item.price}</p>
              </div>
              <p className="mt-1 text-sm text-stone">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 luxury-border rounded-2xl bg-white p-8">
        <h2 className="font-serif text-2xl text-charcoal">Get in touch</h2>
        <p className="mt-2 text-stone">
          Ready to join the directory or have questions about our partner program?{" "}
          <ContactLink subject="Provider inquiry" topic="List my practice">Send us a message</ContactLink>
          {" "}— we typically respond within one business day.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="luxury-border rounded-xl bg-cream p-6">
            <h3 className="font-medium text-charcoal">Want to be listed?</h3>
            <p className="mt-2 text-sm text-stone">
              Apply for a free directory profile or ask about featured placement in your neighborhood.
            </p>
            <Link
              href={contactFormUrl({ subject: "List my practice on Verity", topic: "List my practice" })}
              className="mt-4 inline-block rounded-full bg-charcoal px-6 py-2.5 text-sm font-medium tracking-wider text-ivory transition hover:bg-charcoal/90"
            >
              List my practice
            </Link>
          </div>
          <div className="luxury-border rounded-xl bg-cream p-6">
            <h3 className="font-medium text-charcoal">Preferred program questions</h3>
            <p className="mt-2 text-sm text-stone">
              Verified Partner, Featured Premium, or à la carte placement — ask about pricing and
              availability.
            </p>
            <Link
              href={contactFormUrl({ subject: "Preferred program inquiry", topic: "Featured placement" })}
              className="mt-4 inline-block rounded-full border border-charcoal px-6 py-2.5 text-sm font-medium tracking-wider text-charcoal transition hover:bg-cream"
            >
              Ask about the program
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-stone">
          <ContactLink subject="General inquiry">Send a message</ContactLink>
        </p>
      </section>

      <div className="mt-12 luxury-border rounded-2xl bg-cream p-8 text-center">
        <h2 className="font-serif text-2xl text-charcoal">Nationwide — partner spots open</h2>
        <p className="mt-2 text-stone">
          Join listed providers across the United States. Limited featured spots in each city.
        </p>
        <Link
          href={contactFormUrl({ subject: "List my practice on Verity", topic: "List my practice" })}
          className="mt-6 inline-block rounded-full bg-charcoal px-8 py-3 text-sm font-medium tracking-wider text-ivory"
        >
          Apply to Partner
        </Link>
      </div>

      <p className="mt-8 text-center text-sm text-stone">
        <Link href="/" className="text-gold hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}

import Link from "next/link";

export const metadata = {
  title: "For Spas — Verity",
  description: "List your med spa on Verity. Verified profiles, booking, and product transparency.",
};

export default function ForSpasPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-gold">B2B · Mindbody-style subscriptions</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">Partner with Verity</h1>
      <p className="mt-4 text-lg text-stone">
        Reach clean-beauty-minded clients who care about trust — not bargain hunters on Yelp.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          {
            tier: "Listed",
            price: "Free",
            features: ["Basic profile", "3 photos", "Instagram link"],
          },
          {
            tier: "Partner",
            price: "$149/mo",
            features: [
              "Verified + Clean Partner badge",
              "Booking requests",
              "Product tagging",
              "Review responses",
              "Instagram feed on profile",
            ],
          },
          {
            tier: "Premium",
            price: "$299/mo",
            features: [
              "Featured Miami placement",
              "AI lead insights",
              "Unlimited gallery",
              "Multi-provider profiles",
            ],
          },
        ].map((plan) => (
          <div key={plan.tier} className="luxury-border rounded-2xl bg-white p-6">
            <h3 className="font-serif text-xl text-charcoal">{plan.tier}</h3>
            <p className="mt-2 text-2xl text-gold">{plan.price}</p>
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

      <div className="mt-12 luxury-border rounded-2xl bg-cream p-8 text-center">
        <h2 className="font-serif text-2xl text-charcoal">Miami launch — limited partner spots</h2>
        <p className="mt-2 text-stone">We&apos;re onboarding 30 verified spas for our Miami debut.</p>
        <a
          href="mailto:partners@verity.app?subject=Miami%20Partner%20Application"
          className="mt-6 inline-block rounded-full bg-charcoal px-8 py-3 text-sm font-medium tracking-wider text-ivory"
        >
          Apply to Partner
        </a>
      </div>

      <p className="mt-8 text-center text-sm text-stone">
        <Link href="/" className="text-gold hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}

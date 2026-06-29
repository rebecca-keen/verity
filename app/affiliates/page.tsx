import Link from "next/link";
import { ContactEmail } from "@/components/ContactEmail";

export const metadata = {
  title: "Affiliate Program — How Verity Earns",
  description:
    "Transparency on Verity product affiliate partnerships — Amazon Associates, Sephora, ShareASale, and brand direct programs.",
};

const networks = [
  {
    name: "Amazon Associates",
    apply: "https://affiliate-program.amazon.com",
    desc: "Earn commission on skincare, tools, and K-beauty staples linked from product reviews.",
    env: "NEXT_PUBLIC_AMAZON_AFFILIATE_TAG",
  },
  {
    name: "Sephora Affiliate (Rakuten)",
    apply: "https://www.sephora.com/beauty/affiliates",
    desc: "Clinical and luxury brands sold at Sephora — EltaMD, SkinCeuticals, Dr. Jart+, and more.",
    env: "NEXT_PUBLIC_SEPHORA_AFF_ID",
  },
  {
    name: "ShareASale & CJ Affiliate",
    apply: "https://www.shareasale.com",
    desc: "Independent skincare brands with performance-based commissions and longer cookie windows.",
    env: null,
  },
  {
    name: "Brand direct programs",
    apply: "https://www.skinceuticals.com/pro",
    desc: "Professional channels for SkinCeuticals, Biologique Recherche, Epicutis, and Italian spa brands.",
    env: null,
  },
];

export default function AffiliatesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-gold">Transparency</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">How Verity earns on products</h1>
      <p className="mt-4 text-lg text-stone">
        Verity is independent because we disclose how we make money. Product shop links may earn a
        commission — at no extra cost to you — which supports verified reviews and provider research.
      </p>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-charcoal">Affiliate networks we use (or plan to)</h2>
        <div className="mt-6 space-y-4">
          {networks.map((n) => (
            <div key={n.name} className="luxury-border rounded-xl bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-medium text-charcoal">{n.name}</h3>
                <a
                  href={n.apply}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gold hover:underline"
                >
                  Apply →
                </a>
              </div>
              <p className="mt-2 text-sm text-stone">{n.desc}</p>
              {n.env && (
                <p className="mt-2 font-mono text-xs text-stone">
                  Env: <code className="rounded bg-cream px-1">{n.env}</code>
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 luxury-border rounded-2xl bg-cream p-8">
        <h2 className="font-serif text-xl text-charcoal">Developer setup</h2>
        <p className="mt-2 text-sm text-stone">
          Copy <code className="rounded bg-white px-1">.env.example</code> to{" "}
          <code className="rounded bg-white px-1">.env.local</code> and add your approved affiliate IDs.
          Shop links append tags automatically when env vars are set.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-charcoal p-4 text-xs text-ivory">
{`NEXT_PUBLIC_AMAZON_AFFILIATE_TAG=your-tag-20
NEXT_PUBLIC_SEPHORA_AFF_ID=your-id`}
        </pre>
        <p className="mt-4 text-sm text-stone">
          Implementation: <code className="rounded bg-white px-1">lib/affiliate.ts</code> via{" "}
          <code className="rounded bg-white px-1">getProductAffiliateUrl()</code>
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-charcoal">Other revenue (not affiliate)</h2>
        <ul className="mt-4 space-y-2 text-sm text-stone">
          <li>• Provider subscriptions — featured placement, verified badge, analytics</li>
          <li>• Verity Premium — $12/mo consumer tier for priority AI and saved favorites</li>
          <li>• Lead referrals — pay per qualified booking inquiry (future)</li>
          <li>• Sponsored content & newsletter — clearly labeled when active</li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link href="/for-spas" className="text-gold hover:underline">
            Provider pricing →
          </Link>
          <Link href="/premium" className="text-gold hover:underline">
            Verity Premium →
          </Link>
        </div>
      </section>

      <section className="mt-12 luxury-border rounded-2xl bg-cream p-8 text-center">
        <h2 className="font-serif text-xl text-charcoal">Questions?</h2>
        <p className="mt-2 text-sm text-stone">
          Affiliate transparency, partnerships, or general inquiries — reach us anytime.
        </p>
        <p className="mt-4 text-sm text-stone">
          <ContactEmail />
        </p>
      </section>

      <p className="mt-10 text-center text-sm text-stone">
        <Link href="/products" className="text-gold hover:underline">
          ← Back to product reviews
        </Link>
      </p>
    </div>
  );
}

import Link from "next/link";
import { ContactLink } from "@/components/ContactLink";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Use — Verity",
  description: "Terms governing use of Verity's aesthetics provider directory, AI Concierge, and affiliate shop.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-gold">Legal</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">Terms of Use</h1>
      <p className="mt-4 text-sm text-stone">Last updated: June 30, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-stone">
        <section>
          <h2 className="font-serif text-xl text-charcoal">Acceptance</h2>
          <p className="mt-3">
            By using verityaesthetics.app (the &quot;Site&quot;), you agree to these Terms. If you do not
            agree, do not use the Site.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-charcoal">What Verity is</h2>
          <p className="mt-3">
            Verity is an informational directory and affiliate marketplace. We aggregate publicly
            available provider information, link to third-party retailers, and offer AI-assisted
            search. We are not a medical provider, insurer, or booking platform.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-charcoal">No medical advice</h2>
          <p className="mt-3">
            Content on the Site is for research only. It does not constitute medical advice,
            diagnosis, or treatment recommendations. Consult licensed professionals before any
            procedure. Verify licenses and credentials with state boards and the practice directly.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-charcoal">Listings & accuracy</h2>
          <p className="mt-3">
            &quot;Listed&quot; badges indicate a public directory entry — not an audited license confirmation.
            Ratings may reflect Google, Yelp, or other public sources. Listings may be incomplete or
            outdated. Report errors via our{" "}
            <ContactLink subject="Listing correction" topic="Listing correction">
              contact form
            </ContactLink>
            .
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-charcoal">Affiliate shop</h2>
          <p className="mt-3">
            Product links may earn Verity a commission at no extra cost to you. Prices, availability,
            and fulfillment are handled by the retailer (e.g., Amazon). Product reviews and ratings on
            the Site may reference third-party sources.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-charcoal">AI Concierge</h2>
          <p className="mt-3">
            Concierge responses are generated automatically and may be inaccurate. Matches are drawn
            from our directory based on your query — featured partner placements may appear when that
            program launches. You are responsible for evaluating any provider before booking.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-charcoal">Limitation of liability</h2>
          <p className="mt-3">
            To the fullest extent permitted by law, Verity is not liable for decisions you make based
            on Site content, provider interactions, product purchases, or treatment outcomes. The Site
            is provided &quot;as is&quot; without warranties of any kind.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-charcoal">Changes</h2>
          <p className="mt-3">
            We may update these Terms at any time. Continued use after changes constitutes acceptance.
          </p>
        </section>

        <p className="rounded-xl border border-stone/15 bg-cream p-4 text-xs">
          This document is a general template and is not legal advice. Consult qualified counsel for
          your jurisdiction.
        </p>
      </div>

      <p className="mt-10 text-center text-sm">
        <Link href="/privacy" className="text-gold hover:underline">
          Privacy Policy →
        </Link>
      </p>
    </div>
  );
}

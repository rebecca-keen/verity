import Link from "next/link";
import { ContactLink } from "@/components/ContactLink";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy — Verity",
  description: "How Verity collects, uses, and shares information on our aesthetics provider directory and shop.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-gold">Legal</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">Privacy Policy</h1>
      <p className="mt-4 text-sm text-stone">Last updated: June 30, 2026</p>

      <div className="prose prose-stone mt-10 max-w-none space-y-8 text-sm leading-relaxed text-stone">
        <section>
          <h2 className="font-serif text-xl text-charcoal">Overview</h2>
          <p className="mt-3">
            Verity Aesthetics (&quot;Verity,&quot; &quot;we,&quot; &quot;us&quot;) operates a directory of aesthetics
            clinics, med spas, and dermatology practices, plus an affiliate skincare shop. This policy
            describes how we handle information when you browse our site, use AI Concierge, or contact
            providers through external links.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-charcoal">Information we collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-charcoal">Usage data:</strong> pages viewed, search filters, and
              approximate location derived from IP or browser settings.
            </li>
            <li>
              <strong className="text-charcoal">Concierge queries:</strong> text you submit to AI
              Concierge to generate provider matches.
            </li>
            <li>
              <strong className="text-charcoal">Contact form submissions:</strong> messages you send
              via our contact form for listing corrections, claims, or partner inquiries.
            </li>
            <li>
              <strong className="text-charcoal">Affiliate clicks:</strong> when you follow Amazon or
              other shop links, the retailer may set cookies per their policies.
            </li>
          </ul>
          <p className="mt-3">
            We do not host in-app messaging or store payment information. Calls, bookings, and
            messages go directly to providers via their phone, website, or social accounts.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-charcoal">How we use information</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Operate and improve the provider directory and shop.</li>
            <li>Respond to listing corrections, claims, and partner requests.</li>
            <li>Generate AI Concierge recommendations from your query and filters.</li>
            <li>Measure aggregate traffic and affiliate performance.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-charcoal">Sharing</h2>
          <p className="mt-3">
            We do not sell personal information. We may share data with service providers (hosting,
            analytics, AI inference) under confidentiality terms, and as required by law. Provider
            listings display publicly sourced business information — not private patient data.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-charcoal">Your choices</h2>
          <p className="mt-3">
            You may request correction or removal of a business listing via our{" "}
            <ContactLink subject="Listing correction" topic="Listing correction">
              contact form
            </ContactLink>
            . Browser settings can limit cookies; blocking cookies may affect site functionality.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-charcoal">Contact</h2>
          <p className="mt-3">
            Questions about this policy:{" "}
            <ContactLink subject="Privacy policy question">contact us</ContactLink>
          </p>
        </section>

        <p className="rounded-xl border border-stone/15 bg-cream p-4 text-xs">
          This document is a general template for a marketplace/affiliate site and is not legal
          advice. Consult qualified counsel for compliance with applicable privacy laws.
        </p>
      </div>

      <p className="mt-10 text-center text-sm">
        <Link href="/terms" className="text-gold hover:underline">
          Terms of Use →
        </Link>
      </p>
    </div>
  );
}

import Link from "next/link";
import { ContactEmail } from "@/components/ContactEmail";

export const metadata = {
  title: "How We Verify — Verity",
  description:
    "How Verity sources and presents aesthetics clinic and med spa listings — what we verify, what we don't claim, and how to report errors.",
};

const sections = [
  {
    title: "What we verify",
    items: [
      "Business identity — name, location, and contact details from public listings",
      "Ratings and review counts from Google Business and Yelp where available",
      "Official website and social profiles linked on each listing",
      "Medical director names when explicitly listed on a practice website",
      "Treatment categories and product menus when disclosed publicly",
    ],
  },
  {
    title: "What we don't claim",
    items: [
      "We do not guarantee treatment outcomes or safety",
      "A \"Listed\" badge means the business appears in our public directory — not that we confirmed a state medical license",
      "Board certifications and license numbers are not independently audited unless noted",
      "Listings are aggregated from public sources and may be incomplete or out of date",
    ],
  },
  {
    title: "Our sources",
    items: [
      "Google Business Profile",
      "Yelp",
      "State licensing boards (for user lookup — not automated verification)",
      "Provider official websites",
      "User submissions and corrections via hello@verityaesthetics.app",
    ],
  },
  {
    title: "Rating threshold",
    items: [
      "Where platform ratings apply, we prioritize listings rated 4.4 stars or higher on Google or Yelp",
      "Aggregate listing scores reflect available public review data at time of publication",
      "Newer practices without sufficient reviews may appear with limited rating context",
    ],
  },
  {
    title: "How to report errors",
    items: [
      "Email hello@verityaesthetics.app with the provider name, URL, and what should be corrected",
      "We review submissions and update listings on a rolling basis",
      "For urgent credential concerns, contact your state medical board directly",
    ],
  },
  {
    title: "For providers",
    items: [
      "Claim or update your listing by emailing hello@verityaesthetics.app",
      "Include your practice name, website, and any credentials you'd like displayed",
      "We welcome corrections to medical director names, license references, and treatment menus",
    ],
  },
];

export default function HowWeVerifyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-gold">Transparency</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">How we verify</h1>
      <p className="mt-4 text-lg text-stone">
        Verity helps you research aesthetics clinics and med spas with honest sourcing. Here is what our
        listings mean — and what they do not.
      </p>

      <div className="mt-12 space-y-10">
        {sections.map((section) => (
          <section key={section.title} className="luxury-border rounded-2xl bg-cream p-8">
            <h2 className="font-serif text-2xl text-charcoal">{section.title}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-stone">
              {section.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 text-gold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-gold/30 bg-charcoal px-8 py-10 text-center">
        <p className="font-serif text-xl text-ivory">Questions or corrections?</p>
        <p className="mt-3 text-sm text-stone/90">
          Reach our team at{" "}
          <ContactEmail className="text-gold" subject="Listing correction — Verity" />
        </p>
        <Link
          href="/providers"
          className="mt-6 inline-block rounded-full border border-gold/40 px-6 py-2 text-sm tracking-wider text-gold hover:bg-gold/10"
        >
          Browse providers →
        </Link>
      </div>
    </div>
  );
}

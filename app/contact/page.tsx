import type { Metadata } from "next";
import Link from "next/link";
import { contactMailtoUrl } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

type ContactPageProps = {
  searchParams: Promise<{
    subject?: string;
    topic?: string;
    spa?: string;
  }>;
};

const contactMetadata = {
  title: "Contact — Verity",
  description: "Email the Verity team about listings, corrections, reviews, and partner programs.",
  path: "/contact",
} as const;

export async function generateMetadata({ searchParams }: ContactPageProps): Promise<Metadata> {
  const params = await searchParams;
  const hasPrefill = Boolean(
    params.subject?.trim() || params.topic?.trim() || params.spa?.trim()
  );

  return pageMetadata({
    ...contactMetadata,
    noIndex: hasPrefill,
  });
}

const inquiryTypes = [
  {
    title: "Updated listing",
    description: "Correct hours, address, treatments, medical director, or other profile details.",
    subject: "Listing update: [Practice name]",
  },
  {
    title: "New listing",
    description: "Suggest a med spa or aesthetics practice we should add to the directory.",
    subject: "New listing: [Practice name, city]",
  },
  {
    title: "Leave a review / share experience",
    description: "Share a verified visit review for editorial consideration.",
    subject: "Review: [Practice name]",
  },
  {
    title: "General inquiries",
    description: "Featured placement, claiming a listing, privacy questions, or anything else.",
    subject: "Verity inquiry",
  },
] as const;

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const defaultSubject = params.subject?.trim() ?? "";
  const defaultTopic = params.topic?.trim() ?? "";
  const defaultSpaName = params.spa?.trim() ?? "";
  const mailtoHref = contactMailtoUrl({
    subject: defaultSubject || undefined,
    topic: defaultTopic || undefined,
    spa: defaultSpaName || undefined,
  });

  const hasPrefill = Boolean(defaultSubject || defaultTopic || defaultSpaName);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-gold">Contact</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">Get in touch</h1>
      <p className="mt-4 text-lg text-stone">
        Email us about listings, corrections, reviews, or partner programs — we typically respond
        within one business day.
      </p>

      <div className="mt-10 luxury-border rounded-2xl bg-white p-8 text-center">
        <p className="text-sm text-stone">Get in touch by email</p>
        <a
          href={mailtoHref}
          className="mt-4 inline-block rounded-full bg-charcoal px-8 py-3 text-sm font-medium tracking-wider text-ivory transition hover:bg-charcoal/90"
        >
          {hasPrefill ? "Open email with details" : "Send an email"}
        </a>
        {hasPrefill && (
          <p className="mt-4 text-sm text-stone">
            We&apos;ve pre-filled your subject
            {defaultTopic ? " and topic" : ""}
            {defaultSpaName ? " and practice name" : ""} — add your message and send.
          </p>
        )}
      </div>

      <div className="mt-10">
        <h2 className="font-serif text-2xl text-charcoal">What to include</h2>
        <p className="mt-2 text-sm text-stone">
          A clear subject line helps us route your message faster. Pick the closest match below.
        </p>
        <ul className="mt-6 space-y-4">
          {inquiryTypes.map((item) => (
            <li key={item.title} className="luxury-border rounded-xl bg-cream p-5">
              <p className="font-medium text-charcoal">{item.title}</p>
              <p className="mt-1 text-sm text-stone">{item.description}</p>
              <p className="mt-3 text-xs text-stone">
                Subject line example:{" "}
                <span className="font-medium text-charcoal">{item.subject}</span>
              </p>
              <a
                href={contactMailtoUrl({ subject: item.subject, topic: item.title })}
                className="mt-3 inline-block text-sm text-gold hover:underline"
              >
                Email about {item.title.toLowerCase()} →
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 luxury-border rounded-xl bg-cream p-5 text-sm text-stone">
        <p className="font-medium text-charcoal">Helpful details</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Practice or provider name and city</li>
          <li>Listing URL on verityaesthetics.app, if you have it</li>
          <li>What should change, or what you&apos;d like us to add</li>
          <li>For reviews: visit date and treatments received (firsthand only)</li>
        </ul>
      </div>

      <p className="mt-6 text-center text-sm text-stone">
        <Link href="/" className="text-gold hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}

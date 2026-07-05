import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Verity",
  description: "Get in touch with the Verity team about listings, corrections, and partner programs.",
};

type ContactPageProps = {
  searchParams: Promise<{
    subject?: string;
    topic?: string;
    spa?: string;
  }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const defaultSubject = params.subject?.trim() ?? "";
  const defaultTopic = params.topic?.trim() ?? "";
  const defaultSpaName = params.spa?.trim() ?? "";

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-gold">Contact</p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">Get in touch</h1>
      <p className="mt-4 text-lg text-stone">
        Questions about listings, featured placement, or corrections? Send us a message — we typically
        respond within one business day.
      </p>

      <div className="mt-10 luxury-border rounded-2xl bg-white p-8">
        <ContactForm
          defaultSubject={defaultSubject}
          defaultTopic={defaultTopic}
          defaultSpaName={defaultSpaName}
        />
      </div>

      <p className="mt-6 text-center text-sm text-stone">
        <Link href="/" className="text-gold hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}

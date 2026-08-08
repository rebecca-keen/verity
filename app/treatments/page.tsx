import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbJsonLd,
  buildTreatmentPath,
  getFilteredProviders,
  pageMetadata,
  TREATMENT_CATEGORY_SEO,
} from "@/lib/seo";
import { TREATMENT_BROWSE_ORDER } from "@/lib/spa-utils";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Med Spa Treatments — Injectables, Laser, Facials & More | Verity",
    description:
      "Browse med spa and medical aesthetics treatments — injectables, laser, facials, body contouring, weight loss, IV therapy, and more. Find providers by treatment nationwide.",
    path: "/treatments",
    keywords: ["med spa treatments", "botox", "laser hair removal", "facials", "body contouring", "medical aesthetics"],
  });
}

export default function TreatmentsIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Treatments", path: "/treatments" },
          ]),
        ]}
      />
      <p className="text-xs uppercase tracking-widest text-gold">Browse by treatment</p>
      <h1 className="mt-1 font-serif text-3xl text-charcoal md:text-4xl">Med Spa Treatments</h1>
      <p className="mt-3 max-w-2xl text-sm text-stone">
        Explore medical aesthetics treatments and find listed providers for each — from injectables and laser to
        facials, body contouring, and wellness.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TREATMENT_BROWSE_ORDER.map((cat) => {
          const seo = TREATMENT_CATEGORY_SEO[cat];
          const count = getFilteredProviders({ category: cat }).length;
          return (
            <Link
              key={cat}
              href={buildTreatmentPath(cat)}
              className="luxury-border rounded-2xl bg-white p-5 transition hover:border-gold/40"
            >
              <h2 className="font-serif text-xl text-charcoal">{seo.h1}</h2>
              <p className="mt-1 text-xs uppercase tracking-widest text-gold">{count} providers</p>
              <p className="mt-2 text-sm text-stone">{seo.intro}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

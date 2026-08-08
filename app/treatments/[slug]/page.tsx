import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SpaCard } from "@/components/SpaCard";
import {
  breadcrumbJsonLd,
  buildTreatmentPath,
  getFilteredProviders,
  isTreatmentCategory,
  pageMetadata,
  providersCollectionPageJsonLd,
  providersItemListJsonLd,
  TREATMENT_CATEGORY_SEO,
} from "@/lib/seo";
import { pathForCityName } from "@/lib/geo-routes";
import { TREATMENT_BROWSE_ORDER } from "@/lib/spa-utils";
import type { TreatmentCategory } from "@/lib/types";

export const dynamic = "force-static";

export function generateStaticParams() {
  return TREATMENT_BROWSE_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isTreatmentCategory(slug)) {
    return pageMetadata({
      title: "Treatment not found — Verity",
      description: "This treatment was not found on Verity.",
      path: `/treatments/${slug}`,
      noIndex: true,
    });
  }
  const seo = TREATMENT_CATEGORY_SEO[slug];
  return pageMetadata({
    title: seo.title,
    description: seo.description,
    path: buildTreatmentPath(slug),
    keywords: ["med spa", "medical aesthetics", slug, seo.h1.toLowerCase()],
  });
}

/** Top cities offering a treatment, by provider count, linked to their city landing pages. */
function topCitiesForTreatment(category: TreatmentCategory, limit = 12) {
  const counts = new Map<string, { city: string; state: string; count: number }>();
  for (const spa of getFilteredProviders({ category })) {
    const key = `${spa.state}:${spa.city}`;
    const entry = counts.get(key) ?? { city: spa.city, state: spa.state, count: 0 };
    entry.count += 1;
    counts.set(key, entry);
  }
  return [...counts.values()]
    .map((e) => ({ ...e, path: pathForCityName(e.state, e.city) }))
    .filter((e): e is typeof e & { path: string } => Boolean(e.path))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export default async function TreatmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isTreatmentCategory(slug)) notFound();

  const seo = TREATMENT_CATEGORY_SEO[slug];
  const path = buildTreatmentPath(slug);
  const providers = getFilteredProviders({ category: slug });
  const topCities = topCitiesForTreatment(slug);
  const otherTreatments = TREATMENT_BROWSE_ORDER.filter((c) => c !== slug);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Treatments", path: "/treatments" },
            { name: seo.h1, path },
          ]),
          providersCollectionPageJsonLd({ path, name: seo.h1, description: seo.description }),
          ...(providers.length > 0
            ? [providersItemListJsonLd({ providers, path, listName: seo.h1 })]
            : []),
        ]}
      />
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-stone">
        <Link href="/treatments" className="hover:text-gold">
          Treatments
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{seo.h1}</span>
      </nav>

      <p className="text-xs uppercase tracking-widest text-gold">Treatment</p>
      <h1 className="mt-1 font-serif text-3xl text-charcoal md:text-4xl">{seo.h1}</h1>
      <p className="mt-3 max-w-2xl text-sm text-stone">{seo.intro}</p>

      {topCities.length > 0 && (
        <section className="mt-8">
          <h2 className="font-serif text-2xl text-charcoal">{seo.h1} by city</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {topCities.map((c) => (
              <Link
                key={`${c.state}-${c.city}`}
                href={c.path}
                className="rounded-full border border-stone/20 px-3 py-1.5 text-sm text-charcoal transition hover:border-gold"
              >
                {c.city}, {c.state}
                <span className="ml-1.5 text-xs text-stone">{c.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-charcoal">
          {providers.length} {providers.length === 1 ? "provider" : "providers"} nationwide
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {providers.slice(0, 60).map((spa) => (
            <SpaCard key={spa.slug} spa={spa} />
          ))}
        </div>
      </section>

      <section className="mt-14 border-t border-stone/10 pt-10">
        <h2 className="font-serif text-2xl text-charcoal">Other treatments</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {otherTreatments.map((c) => (
            <Link
              key={c}
              href={buildTreatmentPath(c)}
              className="rounded-full border border-stone/20 px-3 py-1.5 text-sm text-charcoal transition hover:border-gold"
            >
              {TREATMENT_CATEGORY_SEO[c].h1}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

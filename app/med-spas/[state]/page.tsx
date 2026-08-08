import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SpaCard } from "@/components/SpaCard";
import { breadcrumbJsonLd, getFilteredProviders, pageMetadata } from "@/lib/seo";
import { buildCityPath, getStateRoutes, resolveStateRoute } from "@/lib/geo-routes";
import { stateJsonLd, statePageMetadata } from "@/lib/local-seo";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getStateRoutes().map((s) => ({ state: s.stateSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const route = resolveStateRoute(state);
  if (!route) {
    return pageMetadata({
      title: "State not found — Verity",
      description: "This location was not found on Verity.",
      path: `/med-spas/${state}`,
      noIndex: true,
    });
  }
  return statePageMetadata(route);
}

export default async function StateLandingPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const route = resolveStateRoute(state);
  if (!route) notFound();

  const topProviders = getFilteredProviders({ state: route.stateCode }).slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Med Spas", path: "/med-spas" },
            { name: route.stateLabel, path: `/med-spas/${route.stateSlug}` },
          ]),
          ...stateJsonLd(route),
        ]}
      />
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-stone">
        <Link href="/med-spas" className="hover:text-gold">
          Med Spas
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{route.stateLabel}</span>
      </nav>

      <p className="text-xs uppercase tracking-widest text-gold">Browse by city</p>
      <h1 className="mt-1 font-serif text-3xl text-charcoal md:text-4xl">
        Med Spas in {route.stateLabel}
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-stone">
        {route.providerCount} med spas and medical aesthetics providers across {route.cityCount}{" "}
        {route.cityCount === 1 ? "city" : "cities"} in {route.stateLabel}. Pick a city to compare providers by
        treatment and rating.
      </p>

      <section className="mt-8">
        <h2 className="font-serif text-2xl text-charcoal">Cities in {route.stateLabel}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {route.cities.map((c) => (
            <Link
              key={c.citySlug}
              href={buildCityPath(c.stateSlug, c.citySlug)}
              className="rounded-full border border-stone/20 px-3 py-1.5 text-sm text-charcoal transition hover:border-gold"
            >
              {c.city}
              <span className="ml-1.5 text-xs text-stone">{c.providerCount}</span>
            </Link>
          ))}
        </div>
      </section>

      {topProviders.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl text-charcoal">
            Top-rated providers in {route.stateLabel}
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {topProviders.map((spa) => (
              <SpaCard key={spa.slug} spa={spa} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

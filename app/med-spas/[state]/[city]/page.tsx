import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SpaCard } from "@/components/SpaCard";
import { buildProvidersPath, pageMetadata, TREATMENT_CATEGORY_SEO } from "@/lib/seo";
import {
  buildCityPath,
  buildStatePath,
  getAllCityRoutes,
  getSiblingCities,
  resolveCityRoute,
} from "@/lib/geo-routes";
import { breadcrumbJsonLd } from "@/lib/seo";
import {
  cityContent,
  cityFaqJsonLd,
  cityFaqs,
  cityJsonLd,
  cityPageMetadata,
  cityServices,
} from "@/lib/local-seo";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllCityRoutes().map((c) => ({ state: c.stateSlug, city: c.citySlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state, city } = await params;
  const resolved = resolveCityRoute(state, city);
  if (!resolved) {
    return pageMetadata({
      title: "Location not found — Verity",
      description: "This location was not found on Verity.",
      path: `/med-spas/${state}/${city}`,
      noIndex: true,
    });
  }
  return cityPageMetadata(resolved.route, resolved.spas);
}

export default async function CityLandingPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state, city } = await params;
  const resolved = resolveCityRoute(state, city);
  if (!resolved) notFound();

  const { route, spas } = resolved;
  const content = cityContent(route, spas);
  const services = cityServices(route, spas);
  const faqs = cityFaqs(route, spas);
  const siblings = getSiblingCities(route.stateSlug, route.citySlug);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Med Spas", path: "/med-spas" },
            { name: route.stateLabel, path: buildStatePath(route.stateSlug) },
            { name: route.city, path: buildCityPath(route.stateSlug, route.citySlug) },
          ]),
          ...cityJsonLd(route, spas),
          cityFaqJsonLd(route, spas),
        ]}
      />
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-stone">
        <Link href="/med-spas" className="hover:text-gold">
          Med Spas
        </Link>
        <span className="mx-2">/</span>
        <Link href={buildStatePath(route.stateSlug)} className="hover:text-gold">
          {route.stateLabel}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{route.city}</span>
      </nav>

      <p className="text-xs uppercase tracking-widest text-gold">
        {route.city}, {route.stateCode}
      </p>
      <h1 className="mt-1 font-serif text-3xl text-charcoal md:text-4xl">{content.h1}</h1>
      <p className="mt-3 max-w-2xl text-sm text-stone">{content.intro}</p>

      {/* Treatment filters scoped to this city (treatment × location long-tail). */}
      {content.categories.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {content.categories.map((cat) => (
            <Link
              key={cat}
              href={buildProvidersPath({ state: route.stateCode, city: route.city, category: cat })}
              className="rounded-full border border-stone/20 px-3 py-1.5 text-xs text-charcoal transition hover:border-gold"
            >
              {TREATMENT_CATEGORY_SEO[cat].h1} in {route.city}
            </Link>
          ))}
        </div>
      )}

      <section className="mt-10">
        <h2 className="sr-only">Providers in {route.city}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {spas.map((spa) => (
            <SpaCard key={spa.slug} spa={spa} />
          ))}
        </div>
      </section>

      {services.length > 0 && (
        <section className="mt-14 border-t border-stone/10 pt-10">
          <h2 className="font-serif text-2xl text-charcoal">
            Popular treatments in {route.city}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => (
              <Link
                key={svc.category}
                href={svc.path}
                className="luxury-border rounded-2xl bg-white p-5 transition hover:border-gold/40"
              >
                <h3 className="font-serif text-lg text-charcoal">{svc.heading}</h3>
                <p className="mt-2 text-sm text-stone">{svc.blurb}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="mt-14 max-w-3xl border-t border-stone/10 pt-10">
          <h2 className="font-serif text-2xl text-charcoal">
            Med spas in {route.city} — FAQs
          </h2>
          <dl className="mt-6 space-y-6">
            {faqs.map((f) => (
              <div key={f.question}>
                <dt className="font-medium text-charcoal">{f.question}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-stone">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="mt-14 max-w-3xl space-y-4 border-t border-stone/10 pt-10 text-sm leading-relaxed text-stone">
        <h2 className="font-serif text-2xl text-charcoal">
          About med spas in {route.city}, {route.stateLabel}
        </h2>
        {content.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </section>

      {siblings.length > 0 && (
        <section className="mt-12 border-t border-stone/10 pt-10">
          <h2 className="font-serif text-2xl text-charcoal">
            Nearby cities in {route.stateLabel}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {siblings.map((c) => (
              <Link
                key={c.citySlug}
                href={buildCityPath(c.stateSlug, c.citySlug)}
                className="rounded-full border border-stone/20 px-3 py-1.5 text-sm text-charcoal transition hover:border-gold"
              >
                Med spas in {c.city}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

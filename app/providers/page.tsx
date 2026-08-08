import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { SpaDirectory } from "@/components/SpaDirectory";
import { localRedirectTarget } from "@/lib/geo-routes";
import {
  breadcrumbJsonLd,
  buildProvidersPath,
  getFilteredProviders,
  isTreatmentCategory,
  normalizeProvidersFilters,
  providersCollectionPageJsonLd,
  providersFaqJsonLd,
  providersItemListJsonLd,
  providersListingLabel,
  providersPageMetadata,
  treatmentRedirectTarget,
  TREATMENT_CATEGORY_SEO,
} from "@/lib/seo";
import { TREATMENT_BROWSE_ORDER } from "@/lib/spa-utils";
import { buildCityPath, buildStatePath, getStateRoutes } from "@/lib/geo-routes";
import type { TreatmentCategory } from "@/lib/types";

const SKIN_CONCERN_LINKS = [
  { label: "Anti-aging & fine lines", category: "injectables" as const },
  { label: "Laser hair removal", category: "lasers" as const },
  { label: "Laser resurfacing & pigmentation", category: "lasers" as const },
  { label: "Acne & skin texture", category: "beauty" as const },
  { label: "Facials & chemical peels", category: "beauty" as const },
  { label: "Body contouring", category: "body" as const },
  { label: "Medical weight loss", category: "weight-loss" as const },
  { label: "Hormone therapy", category: "hormone-therapy" as const },
  { label: "Wellness & IV therapy", category: "wellness" as const },
];

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; city?: string; category?: string }>;
}): Promise<Metadata> {
  const { state, city, category } = await searchParams;
  const redirectTo = localRedirectTarget({ state, city, category }) ?? treatmentRedirectTarget({ category, state, city });
  if (redirectTo) permanentRedirect(redirectTo);
  const treatmentCategory = isTreatmentCategory(category) ? category : undefined;

  return providersPageMetadata({ category: treatmentCategory, state, city });
}

export default async function ProvidersPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; city?: string; category?: string }>;
}) {
  const { state, city, category } = await searchParams;
  const redirectTo = localRedirectTarget({ state, city, category }) ?? treatmentRedirectTarget({ category, state, city });
  if (redirectTo) permanentRedirect(redirectTo);
  const treatmentCategory = isTreatmentCategory(category) ? category : undefined;
  const filters = normalizeProvidersFilters({ category, state, city });
  const listing = providersListingLabel(filters);
  const filteredProviders = getFilteredProviders(filters);
  const listingPath = buildProvidersPath(filters);
  const stateRoutes = getStateRoutes();
  const topStates = stateRoutes.slice(0, 8);
  const topCities = stateRoutes
    .flatMap((s) => s.cities)
    .sort((a, b) => b.providerCount - a.providerCount)
    .slice(0, 12);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:py-10">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Providers", path: "/providers" },
          ]),
          providersCollectionPageJsonLd({
            path: listingPath,
            name: listing.listName,
            description: listing.intro,
          }),
          ...(filteredProviders.length > 0
            ? [
                providersItemListJsonLd({
                  providers: filteredProviders,
                  path: listingPath,
                  listName: listing.listName,
                }),
              ]
            : []),
          providersFaqJsonLd(),
        ]}
      />
      <p className="text-xs uppercase tracking-widest text-gold">Discovery</p>
      <h1 className="mt-1 font-serif text-3xl text-charcoal md:text-4xl">{listing.h1}</h1>
      <p className="mt-2 max-w-2xl text-sm text-stone">{listing.intro}</p>
      <SpaDirectory initialState={state} initialCity={city} initialCategory={treatmentCategory} />

      <section className="mt-16 border-t border-stone/10 pt-12">
        <h2 className="font-serif text-2xl text-charcoal">Browse by location</h2>
        <p className="mt-2 max-w-2xl text-sm text-stone">
          Find med spas and medical aesthetics clinics in states and cities across the United States.{" "}
          <Link href="/med-spas" className="text-gold hover:underline">
            See all locations →
          </Link>
        </p>
        <div className="mt-6">
          <p className="text-xs uppercase tracking-widest text-gold">Top states</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {topStates.map((state) => (
              <Link
                key={state.stateCode}
                href={buildStatePath(state.stateSlug)}
                className="rounded-full border border-stone/20 px-3 py-1.5 text-xs text-charcoal transition hover:border-gold"
              >
                Med spas in {state.stateLabel}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <p className="text-xs uppercase tracking-widest text-gold">Popular cities</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {topCities.map((c) => (
              <Link
                key={`${c.stateCode}-${c.citySlug}`}
                href={buildCityPath(c.stateSlug, c.citySlug)}
                className="rounded-full border border-stone/20 px-3 py-1.5 text-xs text-charcoal transition hover:border-gold"
              >
                {c.city} med spas
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-charcoal">Browse by treatment &amp; skin concern</h2>
        <p className="mt-2 max-w-2xl text-sm text-stone">
          Filter our nationwide directory for injectables, laser treatments, facials, and body contouring —
          or start with a common skin concern.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {TREATMENT_BROWSE_ORDER.map((key) => {
            const seo = TREATMENT_CATEGORY_SEO[key];
            return (
              <Link
                key={key}
                href={seo.path}
                className="luxury-border rounded-2xl bg-white p-5 transition hover:border-gold/40"
              >
                <h3 className="font-serif text-lg text-charcoal">{seo.h1}</h3>
                <p className="mt-2 text-sm text-stone">{seo.intro}</p>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {SKIN_CONCERN_LINKS.map((item) => (
            <Link
              key={item.label}
              href={TREATMENT_CATEGORY_SEO[item.category].path}
              className="rounded-full border border-stone/20 px-3 py-1.5 text-xs text-charcoal transition hover:border-gold"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

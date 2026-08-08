import type { Metadata } from "next";
import type { CityRoute, StateRoute } from "./geo-routes";
import { buildCityPath, buildStatePath, MED_SPAS_BASE } from "./geo-routes";
import { pageMetadata, providersItemListJsonLd, SITE_NAME, SITE_URL, TREATMENT_CATEGORY_SEO } from "./seo";
import { formatGoogleRating } from "./spa-display";
import type { Spa, TreatmentCategory } from "./types";

function plural(n: number, one: string, many = `${one}s`): string {
  return n === 1 ? one : many;
}

/** Distinct treatment categories across a set of providers, most common first. */
function topCategories(spas: Spa[], limit = 4): TreatmentCategory[] {
  const counts = new Map<TreatmentCategory, number>();
  for (const spa of spas) {
    for (const cat of spa.treatmentCategories) {
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([cat]) => cat);
}

function categoryPhrase(cats: TreatmentCategory[]): string {
  const labels = cats.map((c) => TREATMENT_CATEGORY_SEO[c].h1.toLowerCase());
  if (labels.length === 0) return "medical aesthetics treatments";
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

function distinctNeighborhoods(spas: Spa[], limit = 6): string[] {
  return [...new Set(spas.map((s) => s.neighborhood).filter(Boolean))].slice(0, limit);
}

// ---------------------------------------------------------------------------
// City landing pages
// ---------------------------------------------------------------------------

export interface CityContent {
  h1: string;
  intro: string;
  /** Additional unique body paragraphs, derived from the real listing data. */
  paragraphs: string[];
  categories: TreatmentCategory[];
  neighborhoods: string[];
}

export function cityContent(route: CityRoute, spas: Spa[]): CityContent {
  const { city, stateLabel, providerCount } = route;
  const cats = topCategories(spas);
  const hoods = distinctNeighborhoods(spas);
  const rated = spas.filter((s) => formatGoogleRating(s));
  const providerWord = plural(providerCount, "provider");

  const intro = `Compare ${providerCount} med ${plural(providerCount, "spa")} and medical aesthetics ${providerWord} in ${city}, ${stateLabel}. Browse ${categoryPhrase(cats)} — with public Google ratings, treatment menus, and medical director details where available.`;

  const paragraphs: string[] = [];
  paragraphs.push(
    `${city} is home to ${providerCount} listed med ${plural(providerCount, "spa")} and aesthetics ${providerWord} on Verity, offering treatments from ${categoryPhrase(cats)}. Every listing is built from publicly sourced information so you can research providers before you book.`
  );
  if (hoods.length > 1) {
    paragraphs.push(
      `Providers span ${hoods.length > 1 ? "neighborhoods including " : ""}${hoods.join(", ")}. Filter by treatment and compare ratings to find the right ${city} clinic for your goals.`
    );
  }
  if (rated.length > 0) {
    paragraphs.push(
      `${rated.length} of these ${city} ${providerWord} publish Google ratings, so you can weigh reputation alongside treatment offerings and provider credentials.`
    );
  }

  return {
    h1: `Med Spas in ${city}, ${stateLabel}`,
    intro,
    paragraphs,
    categories: cats,
    neighborhoods: hoods,
  };
}

export function cityPageMetadata(route: CityRoute, spas: Spa[]): Metadata {
  const { city, stateLabel, stateCode, providerCount, stateSlug, citySlug } = route;
  const cats = topCategories(spas, 3);
  const title = `Med Spas in ${city}, ${stateCode} — ${providerCount} ${plural(providerCount, "Provider")} | Verity`;
  const description = `Find the best med spas in ${city}, ${stateLabel}. Compare ${providerCount} medical aesthetics ${plural(providerCount, "provider")} for ${categoryPhrase(cats)} by rating, treatments, and location.`;

  return pageMetadata({
    title,
    description,
    path: buildCityPath(stateSlug, citySlug),
    keywords: [
      `med spa ${city}`,
      `med spa ${city} ${stateCode}`,
      `medical aesthetics ${city}`,
      `botox ${city}`,
      `med spa near me`,
      city,
      stateLabel,
    ],
  });
}

export function cityJsonLd(route: CityRoute, spas: Spa[]) {
  const { city, stateCode, stateLabel, stateSlug, citySlug } = route;
  const path = buildCityPath(stateSlug, citySlug);
  const listName = `Med spas in ${city}, ${stateLabel}`;

  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: listName,
    description: `Directory of med spas and medical aesthetics providers in ${city}, ${stateLabel}.`,
    url: `${SITE_URL}${path}`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    about: {
      "@type": "City",
      name: city,
      containedInPlace: {
        "@type": "State",
        name: stateLabel,
        identifier: stateCode,
      },
    },
  };

  return [collectionPage, providersItemListJsonLd({ providers: spas, path, listName })];
}

// ---------------------------------------------------------------------------
// State landing pages
// ---------------------------------------------------------------------------

export function statePageMetadata(route: StateRoute): Metadata {
  const { stateLabel, stateCode, providerCount, cityCount, stateSlug } = route;
  return pageMetadata({
    title: `Med Spas in ${stateLabel} — ${providerCount} ${plural(providerCount, "Provider")} in ${cityCount} ${plural(cityCount, "City", "Cities")} | Verity`,
    description: `Browse ${providerCount} med spas and medical aesthetics providers across ${cityCount} ${plural(cityCount, "city", "cities")} in ${stateLabel}. Compare injectables, laser, facial, and body providers by city and rating.`,
    path: buildStatePath(stateSlug),
    keywords: [
      `med spa ${stateLabel}`,
      `medical aesthetics ${stateLabel}`,
      `med spa ${stateCode}`,
      `botox ${stateLabel}`,
      stateLabel,
    ],
  });
}

export function stateJsonLd(route: StateRoute) {
  const { stateLabel, stateCode, stateSlug, cities } = route;
  const path = buildStatePath(stateSlug);

  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Med spas in ${stateLabel}`,
    description: `Directory of med spas and medical aesthetics providers across ${stateLabel}.`,
    url: `${SITE_URL}${path}`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    about: { "@type": "State", name: stateLabel, identifier: stateCode },
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Cities with med spas in ${stateLabel}`,
    numberOfItems: cities.length,
    itemListElement: cities.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${c.city}, ${stateCode}`,
      url: `${SITE_URL}${buildCityPath(c.stateSlug, c.citySlug)}`,
    })),
  };

  return [collectionPage, itemList];
}

// ---------------------------------------------------------------------------
// Index page
// ---------------------------------------------------------------------------

export function medSpasIndexMetadata(totalProviders: number, totalStates: number): Metadata {
  return pageMetadata({
    title: "Med Spas Near You — Browse by State & City | Verity",
    description: `Find med spas and medical aesthetics providers near you. Browse ${totalProviders} providers across ${totalStates} states — injectables, laser, facials, body contouring, and more.`,
    path: MED_SPAS_BASE,
    keywords: ["med spa near me", "med spas by state", "medical aesthetics directory", "find a med spa"],
  });
}

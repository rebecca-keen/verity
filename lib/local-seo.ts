import type { Metadata } from "next";
import type { CityRoute, StateRoute } from "./geo-routes";
import { buildCityPath, buildStatePath, MED_SPAS_BASE } from "./geo-routes";
import {
  buildProvidersPath,
  pageMetadata,
  providersItemListJsonLd,
  SITE_NAME,
  SITE_URL,
  TREATMENT_CATEGORY_SEO,
} from "./seo";
import { formatGoogleRating } from "./spa-display";
import type { Spa, TreatmentCategory } from "./types";

/**
 * Consumer search terms per treatment category, used to target service+city
 * queries like "tampa botox" / "tampa laser" in titles, headings, and copy.
 * `short` → title chips; `heading` → on-page H3; `blurb` → descriptive sentence.
 */
const SERVICE_META: Record<TreatmentCategory, { short: string; heading: string; blurb: string }> = {
  injectables: { short: "Botox", heading: "Botox & Injectables", blurb: "Botox, Dysport, dermal fillers, and lip filler" },
  lasers: { short: "Laser", heading: "Laser Treatments", blurb: "laser hair removal, CO2 laser resurfacing, IPL photofacials, and vascular (vein) laser treatments" },
  beauty: { short: "Facials", heading: "Facials & Skincare", blurb: "HydraFacials, chemical peels, and microneedling" },
  body: { short: "Body Contouring", heading: "Body Contouring", blurb: "CoolSculpting, body contouring, and skin tightening" },
  wellness: { short: "Wellness", heading: "Wellness & Peptides", blurb: "wellness programs, peptides, and NAD+ therapy" },
  "iv-therapy": { short: "IV Therapy", heading: "IV Therapy", blurb: "IV drips, hydration, and vitamin infusions" },
  "weight-loss": { short: "Weight Loss", heading: "Medical Weight Loss", blurb: "physician-supervised weight loss, semaglutide, and GLP-1 programs" },
  "hormone-therapy": { short: "Hormone Therapy", heading: "Hormone Therapy", blurb: "bioidentical hormone therapy (BHRT) and hormone optimization" },
  "mens-health": { short: "Men's Health", heading: "Men's Health", blurb: "testosterone therapy (TRT) and men's wellness" },
  "womens-health": { short: "Women's Health", heading: "Women's Health", blurb: "menopause care and hormone balance" },
  "hair-restoration": { short: "Hair Restoration", heading: "Hair Restoration", blurb: "PRP hair restoration and hair loss treatments" },
};
};

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

  const alias = CITY_ALIASES[city]?.[0];
  const cityLabel = alias ? `${city} (${alias})` : city;
  const intro = `Compare ${providerCount} med ${plural(providerCount, "spa")} and medical aesthetics ${providerWord} in ${cityLabel}, ${stateLabel}. Browse ${categoryPhrase(cats)} — with public Google ratings, treatment menus, and medical director details where available.`;

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
  const priceTiers = [...new Set(spas.map((s) => s.priceRange))].sort((a, b) => a.length - b.length);
  if (priceTiers.length > 1) {
    paragraphs.push(
      `Pricing in ${city} spans ${priceTiers[0]} to ${priceTiers[priceTiers.length - 1]} tiers, so you can find both accessible and premium ${city} med spas depending on your treatment and budget.`
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
  const cats = topCategories(spas, 5);
  const serviceChips = cats.slice(0, 3).map((c) => SERVICE_META[c].short).join(", ");
  // Front-load "{city} Med Spas" (targets "tampa med spa") + top services (targets "tampa botox").
  const title = serviceChips
    ? `${city} Med Spas — ${serviceChips} | Verity`
    : `${city} Med Spas — ${providerCount} Providers | Verity`;
  const description = `Compare ${providerCount} of the best med spas in ${city}, ${stateLabel} for ${categoryPhrase(cats.slice(0, 3))}. Ratings, treatments, and locations — find ${city} ${SERVICE_META[cats[0] ?? "injectables"].short.toLowerCase()} near you.`;

  // Service + city long-tail keywords ("tampa botox", "tampa laser hair removal", ...).
  const serviceKeywords = cats.map((c) => `${SERVICE_META[c].short.toLowerCase()} ${city}`);

  // Exact service+city long-tail keywords (from Search Console), both phrasings.
  const names = [city, ...(CITY_ALIASES[city] ?? [])];
  const serviceTerms = [...new Set(cats.flatMap((c) => SERVICE_TERMS[c]))];
  const keywords = new Set<string>();
  for (const name of names) {
    keywords.add(`med spa ${name}`);
    keywords.add(`${name} med spa`);
    keywords.add(`medspa ${name}`);
    keywords.add(`medical spa ${name}`);
    keywords.add(`medical spa near me`);
    for (const term of serviceTerms) {
      keywords.add(`${term} ${name}`);
      keywords.add(`${name} ${term}`);
      keywords.add(`${term} near me`);
    }
  }
  keywords.add(`med spa ${city} ${stateCode}`);
  keywords.add(city);
  keywords.add(stateLabel);
  for (const sk of serviceKeywords) keywords.add(sk);

  return pageMetadata({
    title,
    description,
    path: buildCityPath(stateSlug, citySlug),
    keywords: [...keywords],
  });
}

export interface CityStats {
  providerCount: number;
  ratedCount: number;
  avgRating: number | null;
  priceLow: string | null;
  priceHigh: string | null;
  neighborhoodCount: number;
}

/** Real, per-city aggregate stats — unique data that differentiates each page. */
export function cityStats(route: CityRoute, spas: Spa[]): CityStats {
  const rated = spas.filter((s) => formatGoogleRating(s));
  const ratings = spas.map((s) => s.rating).filter((r) => r > 0);
  const avgRating = ratings.length
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
    : null;
  const priceTiers = [...new Set(spas.map((s) => s.priceRange))].sort((a, b) => a.length - b.length);
  return {
    providerCount: route.providerCount,
    ratedCount: rated.length,
    avgRating,
    priceLow: priceTiers[0] ?? null,
    priceHigh: priceTiers[priceTiers.length - 1] ?? null,
    neighborhoodCount: distinctNeighborhoods(spas, 100).length,
  };
}

/** Highest-rated providers in a city — named internal links (strong entity signal). */
export function topRatedProviders(spas: Spa[], limit = 5): Spa[] {
  return [...spas]
    .sort((a, b) => (b.reviewSources?.google ?? b.rating) - (a.reviewSources?.google ?? a.rating))
    .slice(0, limit);
}
export interface CityService {
  category: TreatmentCategory;
  heading: string;
  blurb: string;
  count: number;
  path: string;
}

/** Service sections for a city page — each targets a "{service} in {city}" query. */
export function cityServices(route: CityRoute, spas: Spa[]): CityService[] {
  const { city, stateCode } = route;
  const counts = new Map<TreatmentCategory, number>();
  for (const spa of spas) {
    for (const cat of spa.treatmentCategories) counts.set(cat, (counts.get(cat) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({
      category,
      count,
      heading: `${SERVICE_META[category].heading} in ${city}`,
      blurb: `${count} ${plural(count, "provider")} in ${city} offering ${SERVICE_META[category].blurb}.`,
      path: buildProvidersPath({ category, state: stateCode, city }),
    }));
}

/** City-specific FAQs — target long-tail service+city questions and FAQ rich results. */
export function cityFaqs(route: CityRoute, spas: Spa[]): { question: string; answer: string }[] {
  const { city, stateLabel, providerCount } = route;
  const cats = topCategories(spas, 4);
  const faqs: { question: string; answer: string }[] = [];

  if (cats.includes("injectables")) {
    const n = spas.filter((s) => s.treatmentCategories.includes("injectables")).length;
    faqs.push({
      question: `Where can I get Botox in ${city}?`,
      answer: `Verity lists ${n} med ${plural(n, "spa")} in ${city}, ${stateLabel} offering Botox and injectables. Compare their public ratings, treatment menus, and provider credentials above to find one near you.`,
    });
  }
  faqs.push({
    question: `How do I choose the best med spa in ${city}?`,
    answer: `Compare public Google ratings, the treatments offered, provider credentials, and medical director details — all shown on each ${city} provider's Verity listing — then reach out to the clinic directly.`,
  });
  faqs.push({
    question: `What treatments do ${city} med spas offer?`,
    answer: `Med spas in ${city} on Verity offer ${categoryPhrase(cats)}. Use the treatment sections above to see providers for each service.`,
  });
  faqs.push({
    question: `How many med spas are in ${city}?`,
    answer: `Verity currently lists ${providerCount} med ${plural(providerCount, "spa")} and medical aesthetics ${plural(providerCount, "provider")} in ${city}, ${stateLabel}, built from publicly sourced information.`,
  });
  faqs.push({
    question: `How much do treatments cost at ${city} med spas?`,
    answer: `Cost varies by provider and treatment — for example ${categoryPhrase(cats.slice(0, 2))}. Compare price tiers ($ to $$$$) and treatment menus on each ${city} listing to estimate pricing before you book.`,
  });
  return faqs;
}

export function cityFaqJsonLd(route: CityRoute, spas: Spa[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cityFaqs(route, spas).map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
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

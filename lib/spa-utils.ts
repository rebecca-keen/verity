import type { Metro, ProviderType, Spa, Treatment, TreatmentCategory, USStateCode } from "./types";
import { getStateBoardName } from "./verification-links";

export type { USStateCode };

/** All 50 US states + DC for directory filters. */
export const US_STATES: { code: USStateCode | "All"; label: string }[] = [
  { code: "All", label: "All States" },
  { code: "AL", label: "Alabama" },
  { code: "AK", label: "Alaska" },
  { code: "AZ", label: "Arizona" },
  { code: "AR", label: "Arkansas" },
  { code: "CA", label: "California" },
  { code: "CO", label: "Colorado" },
  { code: "CT", label: "Connecticut" },
  { code: "DE", label: "Delaware" },
  { code: "DC", label: "District of Columbia" },
  { code: "FL", label: "Florida" },
  { code: "GA", label: "Georgia" },
  { code: "HI", label: "Hawaii" },
  { code: "ID", label: "Idaho" },
  { code: "IL", label: "Illinois" },
  { code: "IN", label: "Indiana" },
  { code: "IA", label: "Iowa" },
  { code: "KS", label: "Kansas" },
  { code: "KY", label: "Kentucky" },
  { code: "LA", label: "Louisiana" },
  { code: "ME", label: "Maine" },
  { code: "MD", label: "Maryland" },
  { code: "MA", label: "Massachusetts" },
  { code: "MI", label: "Michigan" },
  { code: "MN", label: "Minnesota" },
  { code: "MS", label: "Mississippi" },
  { code: "MO", label: "Missouri" },
  { code: "MT", label: "Montana" },
  { code: "NE", label: "Nebraska" },
  { code: "NV", label: "Nevada" },
  { code: "NH", label: "New Hampshire" },
  { code: "NJ", label: "New Jersey" },
  { code: "NM", label: "New Mexico" },
  { code: "NY", label: "New York" },
  { code: "NC", label: "North Carolina" },
  { code: "ND", label: "North Dakota" },
  { code: "OH", label: "Ohio" },
  { code: "OK", label: "Oklahoma" },
  { code: "OR", label: "Oregon" },
  { code: "PA", label: "Pennsylvania" },
  { code: "RI", label: "Rhode Island" },
  { code: "SC", label: "South Carolina" },
  { code: "SD", label: "South Dakota" },
  { code: "TN", label: "Tennessee" },
  { code: "TX", label: "Texas" },
  { code: "UT", label: "Utah" },
  { code: "VT", label: "Vermont" },
  { code: "VA", label: "Virginia" },
  { code: "WA", label: "Washington" },
  { code: "WV", label: "West Virginia" },
  { code: "WI", label: "Wisconsin" },
  { code: "WY", label: "Wyoming" },
];

export function getStateLabel(code: string): string {
  return US_STATES.find((s) => s.code === code)?.label ?? code;
}

export function filterSpasByState(spaList: Spa[], state: USStateCode | "All"): Spa[] {
  if (state === "All") return spaList;
  return spaList.filter((s) => s.state === state);
}

export function getCitiesByState(spaList: Spa[], state: USStateCode | "All"): string[] {
  const scoped = filterSpasByState(spaList, state);
  return [...new Set(scoped.map((s) => s.city))].sort();
}

export function filterSpasByCity(spaList: Spa[], city: string | "All"): Spa[] {
  if (city === "All") return spaList;
  return spaList.filter((s) => s.city === city);
}

export function getNeighborhoodsByStateAndCity(
  spaList: Spa[],
  state: USStateCode | "All",
  city: string | "All"
): string[] {
  let scoped = filterSpasByState(spaList, state);
  if (city !== "All") scoped = scoped.filter((s) => s.city === city);
  return [...new Set(scoped.map((s) => s.neighborhood))].sort();
}

export function searchSpasByText(spaList: Spa[], query: string): Spa[] {
  const q = query.trim().toLowerCase();
  if (!q) return spaList;
  return spaList.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.neighborhood.toLowerCase().includes(q) ||
      s.tagline.toLowerCase().includes(q)
  );
}

export function getSpaLocationLabel(spa: Spa): string {
  if (spa.metro) {
    return `${spa.neighborhood}, ${spa.city} · ${METRO_LABELS[spa.metro]}`;
  }
  return `${spa.neighborhood}, ${spa.city}, ${spa.state}`;
}

export function getLocationFilterLabel(
  state: USStateCode | "All",
  city: string | "All",
  neighborhood: string | "All"
): string {
  if (state === "All") return "the United States";
  const stateName = getStateLabel(state);
  if (city === "All") return stateName;
  if (neighborhood === "All") return `${city}, ${stateName}`;
  return `${neighborhood}, ${city}`;
}

/** Human-readable location for results copy — e.g. "Tampa, FL" or "Florida". */
export function getResultsLocationLabel(
  state: USStateCode | "All",
  city: string | "All",
  neighborhood: string | "All"
): string {
  if (state === "All") return "across the United States";
  if (city === "All") return getStateLabel(state);
  if (neighborhood === "All") return `${city}, ${state}`;
  return `${neighborhood}, ${city}`;
}

export const POPULAR_STATE_CODES: USStateCode[] = ["FL", "CA", "TX", "NY"];

export const POPULAR_CITY_SHORTCUTS: { label: string; state: USStateCode; city: string }[] = [
  { label: "Miami", state: "FL", city: "Miami" },
  { label: "Tampa", state: "FL", city: "Tampa" },
  { label: "Los Angeles", state: "CA", city: "Los Angeles" },
  { label: "NYC", state: "NY", city: "New York" },
  { label: "Atlanta", state: "GA", city: "Atlanta" },
];

/** Match a city name from search text and return state + city when unambiguous. */
export function resolveLocationFromQuery(
  spaList: Spa[],
  query: string
): { state: USStateCode; city: string } | null {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return null;

  const exact = spaList.filter((s) => s.city.toLowerCase() === q);
  if (exact.length > 0) {
    const keys = new Set(exact.map((s) => `${s.state}:${s.city}`));
    if (keys.size === 1) {
      return { state: exact[0].state as USStateCode, city: exact[0].city };
    }
    return null;
  }

  const partial = spaList.filter((s) => s.city.toLowerCase().startsWith(q));
  const partialKeys = new Set(partial.map((s) => `${s.state}:${s.city}`));
  if (partialKeys.size === 1 && partial.length > 0) {
    return { state: partial[0].state as USStateCode, city: partial[0].city };
  }

  return null;
}

export function hasActiveLocationFilters(
  state: USStateCode | "All",
  city: string | "All",
  neighborhood: string | "All",
  search: string
): boolean {
  return state !== "All" || city !== "All" || neighborhood !== "All" || search.trim().length > 0;
}

export function hasActiveFilters(
  state: USStateCode | "All",
  city: string | "All",
  neighborhood: string | "All",
  search: string,
  category: TreatmentCategory | "All",
  providerType: ProviderType | "All"
): boolean {
  return (
    hasActiveLocationFilters(state, city, neighborhood, search) ||
    category !== "All" ||
    providerType !== "All"
  );
}

export function parseLocationSearchParams(
  stateParam: string | undefined,
  cityParam: string | undefined
): { state: USStateCode | "All"; city: string | "All" } {
  const validState =
    stateParam && US_STATES.some((s) => s.code === stateParam && s.code !== "All")
      ? (stateParam as USStateCode)
      : "All";
  const city = cityParam?.trim() ? cityParam : "All";
  return { state: validState, city };
}

export const FLORIDA_METROS: Metro[] = [
  "south-florida",
  "tampa-bay",
  "central-florida",
  "north-florida",
  "northwest-florida",
  "southwest-florida",
  "treasure-coast",
];

export const METRO_LABELS: Record<Metro, string> = {
  "south-florida": "South Florida",
  "tampa-bay": "Tampa Bay",
  "central-florida": "Central Florida",
  "north-florida": "North Florida",
  "northwest-florida": "Northwest Florida",
  "southwest-florida": "Southwest Florida",
  "treasure-coast": "Treasure Coast",
};

/** Primary hub city per region — used for "Winter Park (Orlando area)" style labels. */
export const METRO_PRIMARY_CITY: Record<Metro, string> = {
  "south-florida": "Miami",
  "tampa-bay": "Tampa",
  "central-florida": "Orlando",
  "north-florida": "Jacksonville",
  "northwest-florida": "Destin",
  "southwest-florida": "Fort Myers",
  "treasure-coast": "Port St. Lucie",
};

export const METRO_FILTERS: { label: string; value: Metro | "All" }[] = [
  { label: "All regions", value: "All" },
  ...FLORIDA_METROS.map((value) => ({
    label: METRO_LABELS[value],
    value,
  })),
];

export function getCityFilterLabel(city: string, metro: Metro): string {
  const primary = METRO_PRIMARY_CITY[metro];
  if (city === primary) return city;
  return `${city} (${primary} area)`;
}

export function getAreaFilterLabel(area: string, city: string, metro: Metro): string {
  const primary = METRO_PRIMARY_CITY[metro];
  if (city === primary) return area;
  return `${area} (${city} area)`;
}

export function getCitiesByMetro(spaList: Spa[], metro: Metro | "All"): string[] {
  const scoped = metro === "All" ? spaList : spaList.filter((s) => s.metro === metro);
  return [...new Set(scoped.map((s) => s.city))].sort();
}

export function getAreasByCity(spaList: Spa[], metro: Metro | "All", city: string | "All"): string[] {
  let scoped = metro === "All" ? spaList : spaList.filter((s) => s.metro === metro);
  if (city !== "All") scoped = scoped.filter((s) => s.city === city);
  return [...new Set(scoped.map((s) => s.neighborhood))].sort();
}

/** @deprecated Use getAreasByCity */
export function getNeighborhoodsForMetro(spaList: Spa[], metro: Metro | "All"): string[] {
  return getAreasByCity(spaList, metro, "All");
}

const METRO_AREA_CODES: Record<Metro, string[]> = {
  "south-florida": ["305", "786", "954", "561"],
  "tampa-bay": ["813", "727", "941"],
  "central-florida": ["407", "321", "863"],
  "north-florida": ["904", "352", "850"],
  "northwest-florida": ["850", "448"],
  "southwest-florida": ["239", "941"],
  "treasure-coast": ["772", "561"],
};

export function defaultPhoneForMetro(metro: Metro, index: number): string {
  const codes = METRO_AREA_CODES[metro];
  const code = codes[index % codes.length];
  return `(${code}) 555-${String(1000 + (index % 9000)).padStart(4, "0")}`;
}

const PROVIDER_TYPE_LABELS: Record<ProviderType, string> = {
  "med-spa": "Med Spa",
  "aesthetics-clinic": "Aesthetics Clinic",
  "dermatology-aesthetics": "Dermatology",
};

export function getProviderTypeLabel(type: ProviderType) {
  return PROVIDER_TYPE_LABELS[type];
}

export const PROVIDER_TYPE_FILTERS: { label: string; value: ProviderType | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Med Spa", value: "med-spa" },
  { label: "Aesthetics Clinic", value: "aesthetics-clinic" },
  { label: "Dermatology", value: "dermatology-aesthetics" },
];

const CATEGORY_LABELS: Record<TreatmentCategory, string> = {
  injectables: "Injectables",
  lasers: "Lasers",
  beauty: "Beauty & Facials",
  body: "Body Contouring",
  wellness: "Wellness & IV",
  "weight-loss": "Weight Loss",
  "hormone-therapy": "Hormone Therapy",
  "hair-restoration": "Hair Restoration",
};

export function getCategoryLabel(cat: TreatmentCategory) {
  return CATEGORY_LABELS[cat];
}

const GENERIC_TREATMENT_LISTS: Treatment[][] = [
  ["botox", "laser", "facial"],
  ["botox", "fillers", "laser", "facial"],
  ["botox", "fillers", "laser", "facial", "microneedling"],
];

export function isGenericTreatmentList(treatments: Treatment[]): boolean {
  const key = [...treatments].sort().join(",");
  return GENERIC_TREATMENT_LISTS.some((generic) => [...generic].sort().join(",") === key);
}

/** Infer concrete treatments from listing copy when seed data uses boilerplate defaults. */
export function inferTreatmentsFromCopy(description: string, tagline: string, name = ""): Treatment[] {
  const text = `${description} ${tagline} ${name}`.toLowerCase();
  const treatments = new Set<Treatment>();

  if (/milan laser|laser hair removal clinic|laser hair removal specialist|laser removal clinic/.test(text)) {
    treatments.add("laser");
    return Array.from(treatments);
  }

  if (
    /\bbotox\b|\bdysport\b|\bxeomin\b|\bjeuveau\b|\binjectable|\bfiller|\bjuvederm\b|\brestylane\b|\bsculptra\b|\bkybella\b|\blip filler|\bcheek filler/.test(
      text
    )
  ) {
    if (/\bbotox\b|\bdysport\b|\bxeomin\b|\bjeuveau\b|\binjectable/.test(text)) treatments.add("botox");
    if (/\bfiller|\bjuvederm\b|\brestylane\b|\bsculptra\b|\bkybella\b|\blip filler|\bcheek filler/.test(text)) {
      treatments.add("fillers");
    }
    if (treatments.size === 0) {
      treatments.add("botox");
      treatments.add("fillers");
    }
  }

  if (
    /\blaser|\bipl\b|\bbbl\b|\bhalo\b|\bclear\s*\+?\s*brilliant|\bresurfacing|\bhair removal|\bphotofacial|\bfraxel|\bmoxi\b|\butherapy\b|\brf microneedling|\bmorpheus|\bsofwave|\bcosmetic laser/.test(
      text
    )
  ) {
    treatments.add("laser");
  }

  if (
    /\bfacial|\bhydrafacial|\bchemical peel|\bpeel\b|\bskin rejuvenation|\bdermaplaning|\bmicrodermabrasion|\bglow|\bskincare|\bskin care|\bacne treatment|\bfine-line|\bsun-damage|\btherapeutic facial/.test(
      text
    )
  ) {
    treatments.add("facial");
  }

  if (/\bmicroneedling|\brf microneedling|\bmorpheus8|\bprp facial|\bcollagen induction/.test(text)) {
    treatments.add("microneedling");
  }

  if (
    /\bbody contour|\bcoolsculpt|\bemsculpt|\bbody sculpt|\bcellulite|\bnon-surgical body|\bbody treatment|\bcooltone|\btru sculpt|\bemsella|\bskin tightening/.test(
      text
    )
  ) {
    treatments.add("body-contouring");
  }

  if (
    /weight loss|semaglutide|tirzepatide|glp-?1|ozempic|wegovy|mounjaro|phentermine|medical weight loss|weight management/.test(
      text
    )
  ) {
    treatments.add("weight-loss");
  }

  if (
    /hormone therapy|hormone replacement|\bbhrt\b|testosterone|bioidentical hormone|\bhrt\b|hormone optimization|hormone pellet|\btrt\b|testosterone therapy|low testosterone|men'?s health|women'?s health|menopause|bio-identical hormone/.test(
      text
    )
  ) {
    treatments.add("hormone-therapy");
  }

  if (
    /hair restoration|hair transplant|prp hair|hair loss treatment|neograft|\bartas\b|follicular unit|hair regrowth/.test(
      text
    ) &&
    !/hair removal/.test(text)
  ) {
    treatments.add("hair-restoration");
  }

  if (
    /\bwellness\b|iv therapy|vitamin drip|\bnad\+|\bnad therapy|peptide therapy|functional medicine|vitamin injection|iv drip|wellness program/.test(
      text
    )
  ) {
    treatments.add("wellness");
  }

  return Array.from(treatments);
}

export function resolveSpaTreatments(
  treatments: Treatment[],
  description: string,
  tagline: string,
  name = ""
): Treatment[] {
  if (!treatments.length || isGenericTreatmentList(treatments)) {
    const inferred = inferTreatmentsFromCopy(description, tagline, name);
    if (inferred.length > 0) return inferred;
  }
  return treatments;
}

export const TREATMENT_LABELS: Record<Treatment, string> = {
  botox: "Botox",
  fillers: "Fillers",
  laser: "Laser",
  facial: "Facials",
  microneedling: "Microneedling",
  "body-contouring": "Body Contouring",
  "weight-loss": "Weight Loss",
  "hormone-therapy": "Hormone Therapy",
  "hair-restoration": "Hair Restoration",
  wellness: "Wellness & IV",
};

export function getTreatmentLabel(treatment: Treatment): string {
  return TREATMENT_LABELS[treatment];
}

export function deriveTreatmentCategories(treatments: Treatment[]): TreatmentCategory[] {
  const cats = new Set<TreatmentCategory>();
  if (treatments.some((t) => t === "botox" || t === "fillers")) cats.add("injectables");
  if (treatments.includes("laser")) cats.add("lasers");
  if (treatments.some((t) => t === "facial" || t === "microneedling")) cats.add("beauty");
  if (treatments.includes("body-contouring")) cats.add("body");
  if (treatments.includes("wellness")) cats.add("wellness");
  if (treatments.includes("weight-loss")) cats.add("weight-loss");
  if (treatments.includes("hormone-therapy")) cats.add("hormone-therapy");
  if (treatments.includes("hair-restoration")) cats.add("hair-restoration");
  return TREATMENT_BROWSE_ORDER.filter((cat) => cats.has(cat));
}

export const TREATMENT_CATEGORY_FILTERS: { label: string; value: TreatmentCategory | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Injectables", value: "injectables" },
  { label: "Lasers", value: "lasers" },
  { label: "Beauty & Facials", value: "beauty" },
  { label: "Body Contouring", value: "body" },
  { label: "Wellness & IV", value: "wellness" },
  { label: "Weight Loss", value: "weight-loss" },
  { label: "Hormone Therapy", value: "hormone-therapy" },
  { label: "Hair Restoration", value: "hair-restoration" },
];

export const TREATMENT_BROWSE_ORDER: TreatmentCategory[] = [
  "injectables",
  "lasers",
  "beauty",
  "body",
  "wellness",
  "weight-loss",
  "hormone-therapy",
  "hair-restoration",
];

export function sortSpasForDisplay(spaList: Spa[]): Spa[] {
  return [...spaList].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return b.reviewCount - a.reviewCount;
  });
}

export function getTopRatedSpas(spaList: Spa[], limit = 8): Spa[] {
  return sortSpasForDisplay(spaList).slice(0, limit);
}

/** @deprecated Use getTopRatedSpas — no paid featured listings in seed data yet */
export function getFeaturedPremiumSpas(spaList: Spa[], limit = 8): Spa[] {
  return getTopRatedSpas(spaList, limit);
}

/** @deprecated Use resolveMedicalDirectorInfo from spa-trust.ts */
export function parseMedicalDirector(medicalDirector: string): {
  name: string;
  credentials: string;
  boardCertifications: string[];
  specialty?: string;
} {
  const [name, ...rest] = medicalDirector.split(",").map((s) => s.trim());
  return {
    name: name || medicalDirector.trim(),
    credentials: rest.join(", ") || "",
    boardCertifications: [],
  };
}

/** @deprecated Use getHonestCertifications from spa-trust.ts */
export function defaultCertifications(state: string, _premierPartner: boolean, _featuredPremium: boolean): string[] {
  const boardName = getStateBoardName(state);
  return ["Listing sourced from public records", `${boardName} — user verification recommended`, "Medical director — confirm with practice"];
}

/** @deprecated Use getHonestDataSources from spa-trust.ts */
export function defaultDataSources(state: string, _premierPartner: boolean, website: string): string[] {
  const boardName = getStateBoardName(state);
  const sources = ["Google Business Profile", `${boardName} — verification recommended`];
  if (website) sources.push("Provider official website");
  return sources;
}

/** Placeholder defaults copied into bulk-generated spa seeds — replaced by deriveProductSlugs. */
export const DEFAULT_PRODUCT_SLUGS = [
  "eltamd-uv-clear",
  "skinceuticals-discoloration-defense",
  "la-roche-posay-anthelios",
] as const;

export function isDefaultProductSlugs(slugs: string[]): boolean {
  if (slugs.length === 2) {
    const sorted = [...slugs].sort();
    return sorted[0] === "eltamd-uv-clear" && sorted[1] === "skinceuticals-ce-ferulic";
  }
  if (slugs.length !== 3) return false;
  const sorted = [...slugs].sort();
  return (
    sorted[0] === "eltamd-uv-clear" &&
    sorted[1] === "la-roche-posay-anthelios" &&
    sorted[2] === "skinceuticals-discoloration-defense"
  );
}

/** Legacy seed slugs mapped to affiliate-catalog equivalents. */
export const ORPHAN_PRODUCT_SLUG_MAP: Record<string, string> = {
  "amorepacific-vintage": "skinmedica-tns-advanced-serum",
  "beauty-of-joseon-sunscreen": "isdin-eryfotona-actinica",
  "bioderma-sensibio": "isdin-micellar-solution",
  "biologique-recherche-p50": "isdin-essential-cleansing",
  "caudalie-vinoperfect": "caudalie-vinoperfect-serum",
  "collistar-precious": "alastin-restorative-skin-complex",
  "comfort-zone-hydramemory": "la-roche-posay-toleriane-hydrating",
  "cosrx-snail-mucin": "alastin-restorative-skin-complex",
  "dr-jart-cicapair": "la-roche-posay-toleriane-hydrating",
  "epicutis-arctigenin": "is-clinical-pro-heal-serum",
  "laneige-water-bank": "la-roche-posay-toleriane-hydrating",
  "skinceuticals-ce-ferulic": "alastin-c-radical-serum",
  "sulwhasoo-first-care": "skinmedica-tns-advanced-serum",
  "skinmedica-collagen-support": "skinmedica-ha5",
};

const SPA_CATALOG_SLUGS = new Set([
  "eltamd-uv-clear",
  "eltamd-uv-daily-hydration-tinted",
  "la-roche-posay-anthelios",
  "la-roche-posay-anthelios-niacinamide",
  "la-roche-posay-toleriane-hydrating",
  "la-roche-posay-lipikar-ap-max",
  "la-roche-posay-hyalu-b5-suractivated",
  "la-roche-posay-pure-vitamin-c",
  "caudalie-vinoperfect-serum",
  "caudalie-resveratrol-lift-essentials",
  "caudalie-beauty-elixir",
  "caudalie-vinoperfect-moisturizer",
  "skinceuticals-discoloration-defense",
  "isdin-eryfotona-actinica",
  "isdin-eryfotona-ageless",
  "isdin-mineral-powder-spf",
  "isdin-essential-cleansing",
  "isdin-micellar-solution",
  "alastin-hydratint-spf",
  "alastin-c-radical-serum",
  "alastin-restorative-skin-complex",
  "alastin-gentle-cleanser",
  "alastin-regenerating-skin-nectar",
  "skinmedica-tns-advanced-serum",
  "skinmedica-dermal-repair-cream",
  "skinmedica-instant-bright-eye",
  "skinmedica-neck-correct-cream",
  "skinmedica-essential-spf-tinted",
  "skinmedica-essential-spf-clear",
  "skinmedica-ha5",
  "is-clinical-cleansing",
  "is-clinical-pro-heal-serum",
  "is-clinical-genexc-eye-gel",
  "is-clinical-youth-eye-complex",
  "is-clinical-lip-polish",
  "is-clinical-liprotect-spf35",
  "revision-retinol",
  "revision-nectifirm",
  "revision-dermprotect",
  "revision-firming-night",
  "revision-replenisher",
  "revision-night-cream",
  "revision-intellishade-truphysical",
]);

const FEATURED_SPA_PRODUCTS: Record<string, string[]> = {
  "canvas-skin-nashville": [
    "alastin-restorative-skin-complex",
    "skinmedica-instant-bright-eye",
    "eltamd-uv-clear",
  ],
  "luxe-room-denver": [
    "alastin-hydratint-spf",
    "alastin-c-radical-serum",
    "is-clinical-cleansing",
    "skinmedica-ha5",
  ],
  "look-lab-med-spa-phoenix": [
    "skinceuticals-discoloration-defense",
    "isdin-eryfotona-actinica",
    "alastin-regenerating-skin-nectar",
  ],
  "cienega-medical-west-hollywood": [
    "skinmedica-tns-advanced-serum",
    "eltamd-uv-clear",
    "alastin-c-radical-serum",
  ],
  "beverly-wilshire-aesthetics": [
    "alastin-restorative-skin-complex",
    "skinmedica-instant-bright-eye",
    "alastin-c-radical-serum",
  ],
  "skin-by-lovely-los-angeles": [
    "skinmedica-ha5",
    "eltamd-uv-clear",
    "revision-retinol",
  ],
  "skin-pharm-nashville": [
    "alastin-gentle-cleanser",
    "alastin-c-radical-serum",
    "isdin-eryfotona-actinica",
  ],
  "gleam-med-spa-denver": [
    "alastin-regenerating-skin-nectar",
    "isdin-eryfotona-actinica",
    "skinceuticals-discoloration-defense",
  ],
  "injector-5280-denver": [
    "alastin-restorative-skin-complex",
    "skinmedica-instant-bright-eye",
    "eltamd-uv-clear",
  ],
  "collab-medspa-scottsdale": [
    "alastin-hydratint-spf",
    "alastin-c-radical-serum",
    "is-clinical-pro-heal-serum",
  ],
};

const TIER_POOLS: Record<Spa["priceRange"], string[]> = {
  $: [
    "eltamd-uv-clear",
    "la-roche-posay-anthelios",
    "la-roche-posay-toleriane-hydrating",
    "isdin-micellar-solution",
  ],
  $$: [
    "la-roche-posay-pure-vitamin-c",
    "eltamd-uv-daily-hydration-tinted",
    "isdin-eryfotona-actinica",
    "is-clinical-cleansing",
    "la-roche-posay-anthelios-niacinamide",
  ],
  $$$: [
    "skinmedica-tns-advanced-serum",
    "skinceuticals-discoloration-defense",
    "alastin-hydratint-spf",
    "revision-retinol",
    "is-clinical-pro-heal-serum",
    "isdin-essential-cleansing",
    "alastin-gentle-cleanser",
  ],
  $$$$: [
    "skinmedica-tns-advanced-serum",
    "skinceuticals-discoloration-defense",
    "alastin-restorative-skin-complex",
    "alastin-regenerating-skin-nectar",
    "is-clinical-pro-heal-serum",
    "is-clinical-youth-eye-complex",
    "skinmedica-dermal-repair-cream",
  ],
};

const TREATMENT_POOLS: Partial<Record<Treatment, string[]>> = {
  botox: ["skinmedica-tns-advanced-serum", "la-roche-posay-toleriane-hydrating", "alastin-restorative-skin-complex"],
  fillers: ["skinmedica-instant-bright-eye", "alastin-restorative-skin-complex", "skinmedica-tns-advanced-serum"],
  laser: [
    "isdin-eryfotona-actinica",
    "alastin-c-radical-serum",
    "skinceuticals-discoloration-defense",
    "alastin-regenerating-skin-nectar",
    "is-clinical-pro-heal-serum",
  ],
  facial: ["is-clinical-cleansing", "isdin-essential-cleansing", "alastin-gentle-cleanser", "is-clinical-pro-heal-serum"],
  microneedling: [
    "alastin-regenerating-skin-nectar",
    "alastin-hydratint-spf",
    "is-clinical-pro-heal-serum",
    "is-clinical-cleansing",
  ],
  "body-contouring": ["skinmedica-neck-correct-cream", "skinmedica-ha5", "skinmedica-dermal-repair-cream"],
  "weight-loss": ["skinmedica-ha5", "la-roche-posay-toleriane-hydrating", "is-clinical-pro-heal-serum"],
  "hormone-therapy": ["skinmedica-ha5", "is-clinical-pro-heal-serum", "revision-replenisher"],
  "hair-restoration": ["is-clinical-pro-heal-serum", "alastin-regenerating-skin-nectar", "skinmedica-ha5"],
  wellness: ["is-clinical-pro-heal-serum", "revision-replenisher", "skinmedica-ha5"],
};

const PROVIDER_POOLS: Record<ProviderType, string[]> = {
  "med-spa": ["eltamd-uv-clear", "skinmedica-tns-advanced-serum", "isdin-eryfotona-actinica", "alastin-hydratint-spf"],
  "aesthetics-clinic": ["alastin-restorative-skin-complex", "skinceuticals-discoloration-defense", "revision-retinol"],
  "dermatology-aesthetics": [
    "isdin-eryfotona-actinica",
    "la-roche-posay-anthelios",
    "skinceuticals-discoloration-defense",
    "isdin-micellar-solution",
  ],
};

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pickUnique(candidates: string[], count: number, seed: number): string[] {
  const pool = [...new Set(candidates.filter((s) => SPA_CATALOG_SLUGS.has(s)))];
  if (pool.length === 0) return ["eltamd-uv-clear"];
  const picked: string[] = [];
  for (let i = 0; picked.length < count && i < pool.length * 2; i++) {
    const slug = pool[(seed + i * 7) % pool.length];
    if (!picked.includes(slug)) picked.push(slug);
  }
  return picked.slice(0, count);
}

export type ProductSlugInput = {
  slug: string;
  providerType: ProviderType;
  treatments: Treatment[];
  priceRange: Spa["priceRange"];
};

/** Assign 2–4 plausible retail products based on provider profile and spa slug. */
export function deriveProductSlugs(input: ProductSlugInput): string[] {
  const featured = FEATURED_SPA_PRODUCTS[input.slug];
  if (featured) return featured.filter((s) => SPA_CATALOG_SLUGS.has(s));

  const seed = hashSlug(input.slug);
  const count = 2 + (seed % 3);
  const candidates: string[] = [];

  candidates.push(...TIER_POOLS[input.priceRange]);
  candidates.push(...PROVIDER_POOLS[input.providerType]);
  for (const treatment of input.treatments) {
    const pool = TREATMENT_POOLS[treatment];
    if (pool) candidates.push(...pool);
  }

  // Every med spa should include post-procedure SPF when laser or injectables are offered.
  if (input.treatments.includes("laser") || input.treatments.some((t) => t === "botox" || t === "fillers")) {
    candidates.push(
      input.priceRange === "$$$$" ? "alastin-hydratint-spf" : "eltamd-uv-clear",
      input.priceRange === "$$$$" ? "isdin-eryfotona-ageless" : "isdin-eryfotona-actinica"
    );
  }

  return pickUnique(candidates, count, seed);
}

/** Map legacy orphan slugs and replace bulk placeholder defaults. */
export function resolveProductSlugs(input: ProductSlugInput & { productSlugs: string[] }): string[] {
  if (isDefaultProductSlugs(input.productSlugs)) {
    return deriveProductSlugs(input);
  }

  const mapped = input.productSlugs.map((slug) => ORPHAN_PRODUCT_SLUG_MAP[slug] ?? slug);
  const valid = [...new Set(mapped.filter((slug) => SPA_CATALOG_SLUGS.has(slug)))];
  if (valid.length === 0) return deriveProductSlugs(input);
  return valid.slice(0, 4);
}

import type { Metro, ProviderType, Spa, Treatment, TreatmentCategory, USStateCode } from "./types";

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
};

export function getCategoryLabel(cat: TreatmentCategory) {
  return CATEGORY_LABELS[cat];
}

export function deriveTreatmentCategories(treatments: Treatment[]): TreatmentCategory[] {
  const cats = new Set<TreatmentCategory>();
  if (treatments.some((t) => t === "botox" || t === "fillers")) cats.add("injectables");
  if (treatments.includes("laser")) cats.add("lasers");
  if (treatments.some((t) => t === "facial" || t === "microneedling")) cats.add("beauty");
  if (treatments.includes("body-contouring")) cats.add("body");
  return Array.from(cats);
}

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

export function parseMedicalDirector(medicalDirector: string): {
  name: string;
  credentials: string;
  boardCertifications: string[];
  specialty?: string;
} {
  const [name, ...rest] = medicalDirector.split(",").map((s) => s.trim());
  const creds = rest.join(", ") || "Licensed Medical Professional";
  const boards: string[] = [];
  if (creds.includes("MD")) boards.push("Florida Medical License");
  if (creds.includes("NP")) boards.push("Advanced Practice Registered Nurse");
  if (medicalDirector.toLowerCase().includes("plastic")) {
    boards.push("American Board of Plastic Surgery");
  } else if (medicalDirector.toLowerCase().includes("derm")) {
    boards.push("American Board of Dermatology");
  } else if (creds.includes("MD")) {
    boards.push("American Board of Aesthetic Medicine");
  }
  return { name, credentials: creds, boardCertifications: boards };
}

export function defaultCertifications(premierPartner: boolean, featuredPremium: boolean): string[] {
  const base = [
    "Florida DBPR Licensed Facility",
    "Medical Director on File",
    "Licensed Aesthetic Providers",
  ];
  if (premierPartner) {
    base.push("Verity Premier Partner", "HIPAA Compliant Practice", "Product Disclosure Verified");
  }
  if (featuredPremium) {
    base.push("Featured Premium Listing", "Verity Trust Review — Annual Audit");
  }
  return base;
}

export function defaultDataSources(
  premierPartner: boolean,
  website: string
): string[] {
  const sources = [
    "Florida Department of Health — DBPR License Database",
    "Google Business Profile",
    "Florida Board of Medicine — Provider Lookup",
  ];
  if (website) sources.push("Spa official website");
  if (premierPartner) {
    sources.push("Spa-submitted credentials", "Verity verification team review");
  }
  return sources;
}

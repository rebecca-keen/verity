import type { Metro, ProviderType, Spa, Treatment, TreatmentCategory } from "./types";

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
  { label: "All Florida", value: "All" },
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

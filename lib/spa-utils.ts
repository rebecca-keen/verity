import type { Metro, ProviderType, Spa, Treatment, TreatmentCategory } from "./types";

export const METRO_LABELS: Record<Metro, string> = {
  miami: "Miami",
  tampa: "Tampa",
  orlando: "Orlando",
  jacksonville: "Jacksonville",
  naples: "Naples",
  "palm-beach": "Palm Beach",
};

export const METRO_FILTERS: { label: string; value: Metro | "All" }[] = [
  { label: "All Florida", value: "All" },
  ...Object.entries(METRO_LABELS).map(([value, label]) => ({
    label,
    value: value as Metro,
  })),
];

export function getNeighborhoodsForMetro(spaList: Spa[], metro: Metro | "All"): string[] {
  const scoped = metro === "All" ? spaList : spaList.filter((s) => s.metro === metro);
  return [...new Set(scoped.map((s) => s.neighborhood))].sort();
}

const METRO_AREA_CODES: Record<Metro, string[]> = {
  miami: ["305", "786"],
  tampa: ["813", "727"],
  orlando: ["407", "321"],
  jacksonville: ["904"],
  naples: ["239"],
  "palm-beach": ["561"],
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

import type { ProviderType, Spa, Treatment, TreatmentCategory } from "./types";

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
    if (a.featuredPremium && !b.featuredPremium) return -1;
    if (!a.featuredPremium && b.featuredPremium) return 1;
    const rankA = a.featuredRank ?? 999;
    const rankB = b.featuredRank ?? 999;
    if (rankA !== rankB) return rankA - rankB;
    return b.rating - a.rating;
  });
}

export function getFeaturedPremiumSpas(spaList: Spa[], limit = 8): Spa[] {
  return sortSpasForDisplay(spaList.filter((s) => s.featuredPremium)).slice(0, limit);
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

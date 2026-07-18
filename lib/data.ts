import { amazonAffiliateProducts } from "./amazon-affiliate-products";
import { productImages } from "./product-images";
import { floridaCoastalRealSpas } from "./florida-coastal-real-spas";
import { floridaRealSpas } from "./florida-real-spas";
import { miamiMetroRealSpas } from "./miami-metro-real-spas";
import { nationwideRealSpas } from "./nationwide-real-spas";
import { tampaBayRealSpas } from "./tampa-bay-real-spas";
import { getSpaImages } from "./spa-images";
import { isPlaceholderPhone } from "./spa-link-utils";
import {
  deriveTreatmentCategories,
  resolveSpaTreatments,
  getAreasByCity,
  getTopRatedSpas,
  METRO_LABELS,
  parseMedicalDirector,
  resolveProductSlugs,
  sortSpasForDisplay,
} from "./spa-utils";
import { getHonestCertifications, getHonestDataSources, normalizeSpaTrust } from "./spa-trust";
import type { Metro, Product, ProductOrigin, ProviderType, Review, Spa, SpaSocials, Treatment } from "./types";

export const originLabels: Record<ProductOrigin, string> = {
  US: "American",
  KR: "Korean",
  FR: "French",
  IT: "Italian",
  EU: "European",
};

export const baseProducts: Product[] = [
  {
    slug: "eltamd-uv-clear",
    name: "UV Clear Broad-Spectrum SPF 46",
    brand: "EltaMD",
    category: "SPF",
    trustScore: 92,
    productTags: ["fragrance-free", "paraben-free", "dermatologist-tested"],
    description:
      "Oil-free sunscreen loved by med spas for post-procedure protection. Niacinamide helps calm sensitive skin.",
    rating: 4.8,
    reviewCount: 342,
    image: productImages["eltamd-uv-clear"]!,
    ingredients: ["Zinc Oxide", "Niacinamide", "Hyaluronic Acid"],
    origin: "US",
    premium: false,
    recommended: true,
  },
  {
    slug: "is-clinical-cleansing",
    name: "Cleansing Complex",
    brand: "iS Clinical",
    category: "Cleanser",
    trustScore: 86,
    productTags: ["paraben-free", "dermatologist-tested"],
    description:
      "Gentle resurfacing cleanser used in luxury facial protocols across South Florida.",
    rating: 4.6,
    reviewCount: 456,
    image: productImages["is-clinical-cleansing"]!,
    ingredients: ["Willow Bark", "Sugar Cane Extract", "Chamomile"],
    origin: "US",
    premium: false,
  },
  {
    slug: "revision-retinol",
    name: "Retinol Complete 1.0",
    brand: "Revision Skincare",
    category: "Retinol",
    trustScore: 90,
    productTags: ["dermatologist-tested", "cruelty-free"],
    description: "Clinical retinol used in anti-aging protocols at premier Miami med spas.",
    rating: 4.7,
    reviewCount: 312,
    image: productImages["revision-retinol"]!,
    ingredients: ["Retinol", "Bakuchiol", "Hyaluronic Acid"],
    origin: "US",
    premium: true,
    recommended: true,
  },
  {
    slug: "skinmedica-ha5",
    name: "HA5 Hydra Collagen Hydrator",
    brand: "SkinMedica",
    category: "Moisturizer",
    trustScore: 87,
    productTags: ["dermatologist-tested"],
    description:
      "Next-generation HA⁵ complex with vegan collagen and five forms of hyaluronic acid for deep hydration and visibly plumper skin after injectables and lasers.",
    rating: 4.8,
    reviewCount: 700,
    image: productImages["skinmedica-ha5"]!,
    ingredients: ["Hyaluronic Acid", "Vegan Collagen", "Peptides", "Vitis Flower Stem Extract"],
    origin: "US",
    premium: true,
    recommended: true,
  },
  {
    slug: "skinceuticals-ce-ferulic",
    name: "C E Ferulic with 15% L-Ascorbic Acid",
    brand: "SkinCeuticals",
    category: "Serum",
    trustScore: 94,
    productTags: ["dermatologist-tested", "cruelty-free"],
    description:
      "Gold-standard antioxidant vitamin C serum with ferulic acid — the benchmark brightening treatment at physician-led med spas.",
    rating: 4.8,
    reviewCount: 7248,
    image: productImages["skinceuticals-ce-ferulic"]!,
    ingredients: ["L-Ascorbic Acid", "Vitamin E", "Ferulic Acid"],
    origin: "US",
    premium: true,
    recommended: true,
  },
  {
    slug: "epicutis-arctigenin",
    name: "Arctigenin Brightening Treatment",
    brand: "Epicutis",
    category: "Serum",
    trustScore: 91,
    productTags: ["fragrance-free", "cruelty-free", "dermatologist-tested"],
    description:
      "Clean brightening treatment with proprietary ABSO arctigenin extract — safe for all skin types and post-procedure use.",
    rating: 4.7,
    reviewCount: 420,
    image: productImages["epicutis-arctigenin"]!,
    ingredients: ["Arctium Lappa Seed Oil", "Squalane", "Ferulic Acid", "Tocopherol"],
    origin: "US",
    premium: true,
    recommended: true,
  },
];

function mergeAffiliateProducts(base: Product[], affiliate: Product[]): Product[] {
  const bySlug = new Map<string, Product>();
  for (const product of base) bySlug.set(product.slug, product);
  for (const product of affiliate) {
    const existing = bySlug.get(product.slug);
    bySlug.set(product.slug, existing ? { ...existing, ...product } : product);
  }
  return [...bySlug.values()];
}

function withOfficialImages(catalog: Product[]): Product[] {
  return catalog.map((product) => ({
    ...product,
    image: productImages[product.slug] ?? product.image,
  }));
}

export const products: Product[] = withOfficialImages(
  mergeAffiliateProducts(baseProducts, amazonAffiliateProducts),
);

type SpaSeed = {
  slug: string;
  name: string;
  providerType: ProviderType;
  state?: string;
  neighborhood: string;
  city: string;
  metro?: Metro;
  tagline: string;
  description: string;
  rating: number;
  reviewCount: number;
  googleRating?: number;
  yelpRating?: number;
  listingStatus?: Spa["listingStatus"];
  verified?: boolean;
  premierPartner: boolean;
  featuredRank?: number;
  medicalDirector: string;
  licenseId: string;
  yearsOpen: number;
  treatments: Treatment[];
  priceRange: Spa["priceRange"];
  instagram?: string;
  productSlugs: string[];
  highlights: string[];
  website?: string;
  phone?: string;
  reviewSource?: string;
  socials?: SpaSocials;
  certifications?: string[];
  dataSources?: string[];
};

function buildSocials(seed: SpaSeed): SpaSocials {
  if (seed.socials) return seed.socials;
  if (seed.instagram?.trim()) return { instagram: seed.instagram.trim() };
  return {};
}

function seedSpa(data: SpaSeed): Spa {
  const state = data.state ?? "FL";
  const metro = data.metro;
  const images = getSpaImages(data.slug, data.website);
  const website = data.website?.trim() ?? "";
  const phone =
    data.phone?.trim() && !isPlaceholderPhone(data.phone) ? data.phone.trim() : "";
  const socials = buildSocials(data);
  const reviewSources =
    data.googleRating || data.yelpRating
      ? {
          ...(data.googleRating ? { google: data.googleRating } : {}),
          ...(data.yelpRating ? { yelp: data.yelpRating } : {}),
        }
      : undefined;
  const listingStatus =
    data.listingStatus ?? (data.premierPartner ? "verified-partner" : "listed");
  const treatments = resolveSpaTreatments(data.treatments, data.description, data.tagline);

  return normalizeSpaTrust({
    slug: data.slug,
    name: data.name,
    providerType: data.providerType,
    state,
    neighborhood: data.neighborhood,
    city: data.city,
    metro,
    reviewSources,
    tagline: data.tagline,
    description: data.description,
    rating: data.rating,
    reviewCount: data.reviewCount,
    listingStatus,
    verified: data.verified ?? false,
    premierPartner: data.premierPartner ?? false,
    featuredPremium: false,
    medicalDirector: data.medicalDirector,
    medicalDirectorInfo: parseMedicalDirector(data.medicalDirector),
    licenseId: data.licenseId,
    yearsOpen: data.yearsOpen,
    treatments,
    treatmentCategories: deriveTreatmentCategories(treatments),
    priceRange: data.priceRange,
    website,
    phone,
    socials,
    certifications:
      data.certifications ??
      getHonestCertifications({ website, state, premierPartner: false, featuredPremium: false }),
    dataSources:
      data.dataSources ??
      getHonestDataSources({ website, reviewSources, state }, data.reviewSource),
    image: images.hero,
    imageSource: images.source,
    logo: images.logo,
    gallery: images.gallery,
    productSlugs: resolveProductSlugs({
      slug: data.slug,
      providerType: data.providerType,
      treatments,
      priceRange: data.priceRange,
      productSlugs: data.productSlugs,
    }),
    highlights: data.highlights,
  });
}

function dedupeSpasBySlug(seeds: SpaSeed[]): SpaSeed[] {
  const bySlug = new Map<string, SpaSeed>();
  for (const seed of seeds) {
    if (!bySlug.has(seed.slug)) bySlug.set(seed.slug, seed);
  }
  return [...bySlug.values()];
}

const REAL_SPA_SEEDS: SpaSeed[] = dedupeSpasBySlug([
  ...floridaRealSpas,
  ...floridaCoastalRealSpas,
  ...tampaBayRealSpas,
  ...miamiMetroRealSpas,
  ...nationwideRealSpas,
]);

export const spas: Spa[] = REAL_SPA_SEEDS.map((seed) => seedSpa(seed));
export const metros = Object.keys(METRO_LABELS) as Metro[];

export const neighborhoods = getAreasByCity(spas, "All", "All");

export function getNeighborhoodsByMetro(metro: Metro | "All") {
  return getAreasByCity(spas, metro, "All");
}

export const reviews: Review[] = [];

export function getSpa(slug: string) {
  return spas.find((s) => s.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getSpaReviews(spaSlug: string) {
  const spa = getSpa(spaSlug);
  if (!spa) return [];
  return reviews.filter((r) => r.spaSlug === spaSlug);
}

export function getProductReviews(productSlug: string) {
  return reviews.filter((r) => r.productSlug === productSlug);
}

export function getSpasForProduct(productSlug: string) {
  return spas.filter((s) => s.productSlugs.includes(productSlug));
}

export function getProductsForSpa(spaSlug: string) {
  const spa = getSpa(spaSlug);
  if (!spa) return [];
  return products.filter((p) => spa.productSlugs.includes(p.slug));
}

export function getSpasByNeighborhood(neighborhood: string) {
  if (!neighborhood || neighborhood === "All") return spas;
  return spas.filter((s) => s.neighborhood === neighborhood);
}

export function getSortedSpas() {
  return sortSpasForDisplay(spas);
}

export function getFeaturedPremiumSpasFromData(limit = 8) {
  return getTopRatedSpas(spas, limit);
}

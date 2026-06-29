export type ProductTag =
  | "fragrance-free"
  | "paraben-free"
  | "vegan"
  | "reef-safe"
  | "cruelty-free"
  | "dermatologist-tested";

export type ProductOrigin = "US" | "KR" | "FR" | "IT" | "EU";

export type Treatment =
  | "botox"
  | "fillers"
  | "laser"
  | "facial"
  | "microneedling"
  | "body-contouring";

export type TreatmentCategory = "injectables" | "lasers" | "beauty" | "body";

export type ProviderType = "med-spa" | "aesthetics-clinic" | "dermatology-aesthetics";

/** Florida region group for filtering (not a single city). */
export type Metro =
  | "south-florida"
  | "tampa-bay"
  | "central-florida"
  | "north-florida"
  | "southwest-florida"
  | "treasure-coast";

export interface SpaSocials {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
}

export interface MedicalDirectorInfo {
  name: string;
  credentials: string;
  boardCertifications: string[];
  specialty?: string;
}

export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: string;
  trustScore: number;
  productTags: ProductTag[];
  description: string;
  rating: number;
  reviewCount: number;
  image: string;
  ingredients: string[];
  affiliateUrl?: string;
  affiliatePartner?: string;
  origin?: ProductOrigin;
  premium?: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  treatment?: string;
  productSlug?: string;
}

export interface Spa {
  slug: string;
  name: string;
  providerType: ProviderType;
  neighborhood: string;
  city: string;
  metro: Metro;
  tagline: string;
  description: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  premierPartner: boolean;
  featuredPremium: boolean;
  featuredRank?: number;
  medicalDirector: string;
  medicalDirectorInfo: MedicalDirectorInfo;
  licenseId: string;
  yearsOpen: number;
  treatments: Treatment[];
  treatmentCategories: TreatmentCategory[];
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  website: string;
  phone: string;
  socials: SpaSocials;
  certifications: string[];
  dataSources: string[];
  image: string;
  imageSource: string;
  gallery: string[];
  productSlugs: string[];
  highlights: string[];
}

export interface ConciergeMatch {
  spaSlug: string;
  spaName: string;
  reason: string;
  matchScore: number;
}

export interface BookingRequest {
  spaSlug: string;
  name: string;
  email: string;
  phone: string;
  treatment: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

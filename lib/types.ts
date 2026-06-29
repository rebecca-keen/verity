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

/** Two-letter US state or DC code. */
export type USStateCode =
  | "AL" | "AK" | "AZ" | "AR" | "CA" | "CO" | "CT" | "DE" | "DC"
  | "FL" | "GA" | "HI" | "ID" | "IL" | "IN" | "IA" | "KS" | "KY"
  | "LA" | "ME" | "MD" | "MA" | "MI" | "MN" | "MS" | "MO" | "MT"
  | "NE" | "NV" | "NH" | "NJ" | "NM" | "NY" | "NC" | "ND" | "OH"
  | "OK" | "OR" | "PA" | "RI" | "SC" | "SD" | "TN" | "TX" | "UT"
  | "VT" | "VA" | "WA" | "WV" | "WI" | "WY";

/** Florida region group for filtering (not a single city). */
export type Metro =
  | "south-florida"
  | "tampa-bay"
  | "central-florida"
  | "north-florida"
  | "northwest-florida"
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
  /** Curated for /products/recommended and luxury Amazon shop links */
  recommended?: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  /** Spa this review belongs to — required for spa detail pages */
  spaSlug?: string;
  treatment?: string;
  productSlug?: string;
}

export interface ReviewSources {
  google?: number;
  yelp?: number;
  realself?: number;
}

export interface Spa {
  slug: string;
  name: string;
  providerType: ProviderType;
  /** Two-letter US state code (e.g. FL, CA). */
  state: string;
  neighborhood: string;
  city: string;
  /** Florida region group — present for FL listings only. */
  metro?: Metro;
  tagline: string;
  description: string;
  rating: number;
  reviewCount: number;
  /** Per-platform ratings when available; aggregate `rating` is the listing score. */
  reviewSources?: ReviewSources;
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

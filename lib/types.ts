export type CleanTag =
  | "fragrance-free"
  | "paraben-free"
  | "vegan"
  | "reef-safe"
  | "cruelty-free"
  | "dermatologist-tested";

export type Treatment =
  | "botox"
  | "fillers"
  | "laser"
  | "facial"
  | "microneedling"
  | "body-contouring";

export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: string;
  cleanScore: number;
  cleanTags: CleanTag[];
  description: string;
  rating: number;
  reviewCount: number;
  image: string;
  ingredients: string[];
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
  neighborhood: string;
  city: string;
  tagline: string;
  description: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  cleanPartner: boolean;
  medicalDirector: string;
  licenseId: string;
  yearsOpen: number;
  treatments: Treatment[];
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  instagram: string;
  image: string;
  gallery: string[];
  productSlugs: string[];
  highlights: string[];
}

export interface ConciergeMessage {
  role: "user" | "assistant";
  content: string;
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

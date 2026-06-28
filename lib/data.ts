import type { Product, Review, Spa } from "./types";

export const products: Product[] = [
  {
    slug: "eltamd-uv-clear",
    name: "UV Clear Broad-Spectrum SPF 46",
    brand: "EltaMD",
    category: "SPF",
    cleanScore: 92,
    cleanTags: ["fragrance-free", "paraben-free", "dermatologist-tested"],
    description:
      "Oil-free sunscreen loved by med spas for post-procedure protection. Niacinamide helps calm sensitive skin.",
    rating: 4.8,
    reviewCount: 342,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
    ingredients: ["Zinc Oxide", "Niacinamide", "Hyaluronic Acid"],
  },
  {
    slug: "skinceuticals-ce-ferulic",
    name: "C E Ferulic",
    brand: "SkinCeuticals",
    category: "Serum",
    cleanScore: 78,
    cleanTags: ["dermatologist-tested", "cruelty-free"],
    description:
      "Gold-standard antioxidant serum used before and after laser treatments at top Miami med spas.",
    rating: 4.7,
    reviewCount: 891,
    image:
      "https://images.unsplash.com/photo-1620916561694-4d134e883ab7?w=600&h=600&fit=crop",
    ingredients: ["Vitamin C", "Vitamin E", "Ferulic Acid"],
  },
  {
    slug: "epicutis-arctigenin",
    name: "Arctigenin Brightening Treatment",
    brand: "Epicutis",
    category: "Serum",
    cleanScore: 96,
    cleanTags: ["fragrance-free", "paraben-free", "vegan", "cruelty-free"],
    description:
      "Clean 19-ingredient formula ideal for post-procedure and sensitive skin. Popular at boutique Miami facials.",
    rating: 4.9,
    reviewCount: 128,
    image:
      "https://images.unsplash.com/photo-1570194065650-d99fb4b74108?w=600&h=600&fit=crop",
    ingredients: ["Arctigenin", "Squalane", "Ferulic Acid", "Chia Seed Oil"],
  },
  {
    slug: "is-clinical-cleansing",
    name: "Cleansing Complex",
    brand: "iS Clinical",
    category: "Cleanser",
    cleanScore: 88,
    cleanTags: ["paraben-free", "dermatologist-tested"],
    description:
      "Gentle resurfacing cleanser used in luxury facial protocols across South Florida.",
    rating: 4.6,
    reviewCount: 456,
    image:
      "https://images.unsplash.com/photo-1608248543801-ba43f4474263?w=600&h=600&fit=crop",
    ingredients: ["Willow Bark", "Sugar Cane Extract", "Chamomile"],
  },
];

export const spas: Spa[] = [
  {
    slug: "aether-aesthetics-coral-gables",
    name: "Aether Aesthetics",
    neighborhood: "Coral Gables",
    city: "Miami",
    tagline: "Clean injectables. Transparent protocols.",
    description:
      "Board-supervised boutique med spa specializing in natural-looking injectables and clean post-care. Every product used in treatment is disclosed before your appointment.",
    rating: 4.9,
    reviewCount: 87,
    verified: true,
    cleanPartner: true,
    medicalDirector: "Dr. Elena Morales, MD",
    licenseId: "ME-98421",
    yearsOpen: 6,
    treatments: ["botox", "fillers", "facial", "microneedling"],
    priceRange: "$$$",
    instagram: "aetheraesthetics_mia",
    image:
      "https://images.unsplash.com/photo-1519494020892-80afc2743508?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1515377905703-c4788e51ad09?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop",
    ],
    productSlugs: ["eltamd-uv-clear", "epicutis-arctigenin", "is-clinical-cleansing"],
    highlights: [
      "Full product disclosure before every treatment",
      "Board-certified medical director on-site",
      "Lot-tracked injectables",
    ],
  },
  {
    slug: "lumiere-medspa-brickell",
    name: "Lumière Medspa",
    neighborhood: "Brickell",
    city: "Miami",
    tagline: "Luxury laser. Clean recovery.",
    description:
      "High-end laser and skin rejuvenation with science-led clean beauty protocols. Ideal for professionals who want results without compromising ingredient standards.",
    rating: 4.8,
    reviewCount: 134,
    verified: true,
    cleanPartner: true,
    medicalDirector: "Dr. James Chen, MD",
    licenseId: "ME-87234",
    yearsOpen: 9,
    treatments: ["laser", "facial", "microneedling", "body-contouring"],
    priceRange: "$$$$",
    instagram: "lumiere_medspa_brickell",
    image:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1519824145375-9040b98a2274?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop",
    ],
    productSlugs: ["skinceuticals-ce-ferulic", "eltamd-uv-clear"],
    highlights: [
      "Laser-safe clean product protocols",
      "Patch testing available",
      "Verified visit reviews only",
    ],
  },
  {
    slug: "salt-glow-miami-beach",
    name: "Salt & Glow",
    neighborhood: "Miami Beach",
    city: "Miami",
    tagline: "Coastal clean beauty rituals.",
    description:
      "Facial-forward med spa blending clinical treatments with clean, fragrance-free skincare. Perfect for first-time med spa visitors who want a gentle introduction.",
    rating: 4.7,
    reviewCount: 62,
    verified: true,
    cleanPartner: true,
    medicalDirector: "Dr. Sofia Reyes, NP (MSN)",
    licenseId: "ME-76102",
    yearsOpen: 4,
    treatments: ["facial", "microneedling", "botox"],
    priceRange: "$$",
    instagram: "saltandglow_miami",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289bebecc?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996ef?w=600&h=400&fit=crop",
    ],
    productSlugs: ["epicutis-arctigenin", "is-clinical-cleansing", "eltamd-uv-clear"],
    highlights: [
      "Fragrance-free treatment rooms",
      "Ingredient lists emailed before visit",
      "No-pressure consultations",
    ],
  },
  {
    slug: "forme-aesthetics-wynwood",
    name: "Forme Aesthetics",
    neighborhood: "Wynwood",
    city: "Miami",
    tagline: "Artistry meets accountability.",
    description:
      "Modern injectables studio with transparent pricing and published provider credentials. Strong following for natural lip and jawline work.",
    rating: 4.6,
    reviewCount: 98,
    verified: true,
    cleanPartner: false,
    medicalDirector: "Dr. Marcus Webb, MD",
    licenseId: "ME-91045",
    yearsOpen: 5,
    treatments: ["botox", "fillers", "body-contouring"],
    priceRange: "$$$",
    instagram: "forme_aesthetics",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1596178065880-2314bdb1f869?w=600&h=400&fit=crop",
    ],
    productSlugs: ["skinceuticals-ce-ferulic"],
    highlights: [
      "Published provider credentials",
      "Transparent unit pricing",
      "Digital consent signatures",
    ],
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    author: "Camila R.",
    rating: 5,
    text: "They emailed me every product before my facial — exactly what I needed as someone with fragrance allergies. Zero surprises.",
    date: "2026-05-12",
    verified: true,
    treatment: "Clean Facial",
    productSlug: "epicutis-arctigenin",
  },
  {
    id: "r2",
    author: "Jennifer L.",
    rating: 5,
    text: "Finally a platform where I could see which SPF my spa actually uses. EltaMD post-laser was perfect.",
    date: "2026-04-28",
    verified: true,
    treatment: "Laser Resurfacing",
    productSlug: "eltamd-uv-clear",
  },
  {
    id: "r3",
    author: "Alex M.",
    rating: 4,
    text: "Loved the natural lip filler. Wish booking confirmation was instant, but the spa confirmed within 2 hours.",
    date: "2026-03-15",
    verified: true,
    treatment: "Lip Filler",
  },
  {
    id: "r4",
    author: "Diana K.",
    rating: 5,
    text: "The clean score on Epicutis helped me compare spas. Salt & Glow matched my ingredient standards perfectly.",
    date: "2026-05-01",
    verified: true,
    productSlug: "epicutis-arctigenin",
  },
];

export function getSpa(slug: string) {
  return spas.find((s) => s.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getSpaReviews(spaSlug: string) {
  const spa = getSpa(spaSlug);
  if (!spa) return [];
  const productSet = new Set(spa.productSlugs);
  return reviews.filter(
    (r) =>
      r.treatment ||
      (r.productSlug && productSet.has(r.productSlug))
  );
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

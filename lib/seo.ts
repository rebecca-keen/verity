import type { Metadata } from "next";
import { getContactEmail } from "@/lib/constants";
import { getSortedSpas } from "@/lib/data";
import { formatGoogleRating } from "@/lib/spa-display";
import { filterSpasByCity, filterSpasByState, getStateLabel, US_STATES } from "@/lib/spa-utils";
import type { Product, Review, Spa, TreatmentCategory, USStateCode } from "@/lib/types";

export const SITE_URL = "https://verityaesthetics.app";
export const SITE_NAME = "Verity";
export const SITE_TAGLINE = "Medical Aesthetics, Skincare & Med Spas Nationwide";

export const DEFAULT_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const DEFAULT_DESCRIPTION =
  "Find trusted med spas and medical aesthetics clinics for injectables, laser treatments, facials, and skincare. Compare providers by treatment, skin concerns, ratings, and product transparency — nationwide.";

export const SITE_KEYWORDS = [
  "medical aesthetics",
  "med spa",
  "skincare",
  "skin care",
  "injectables",
  "Botox",
  "dermal fillers",
  "laser treatments",
  "laser resurfacing",
  "skin concerns",
  "acne",
  "anti-aging",
  "facials",
  "beauty",
  "aesthetics clinic",
  "dermatology aesthetics",
];

export const TREATMENT_CATEGORY_SEO: Record<
  TreatmentCategory,
  { title: string; description: string; h1: string; intro: string; path: string }
> = {
  injectables: {
    title: "Injectables Providers — Botox & Fillers | Verity",
    description:
      "Find med spas and aesthetics clinics offering Botox, dermal fillers, and injectables. Compare ratings, medical director info, and product menus nationwide.",
    h1: "Injectables providers",
    intro:
      "Browse listed med spas and medical aesthetics clinics for Botox, dermal fillers, and other injectables. Filter by location and compare public ratings.",
    path: "/providers?category=injectables",
  },
  lasers: {
    title: "Laser Treatment Providers — Med Spas & Clinics | Verity",
    description:
      "Find providers for laser hair removal, laser resurfacing, IPL, and skin rejuvenation. Curated med spas and dermatology aesthetics practices nationwide.",
    h1: "Laser treatment providers",
    intro:
      "Discover med spas and clinics offering laser treatments for hair removal, resurfacing, pigmentation, and skin rejuvenation — with transparent sourcing.",
    path: "/providers?category=lasers",
  },
  beauty: {
    title: "Beauty & Facial Providers — Skincare Treatments | Verity",
    description:
      "Find med spas and aesthetics clinics for facials, chemical peels, microneedling, and skincare-focused beauty treatments across the United States.",
    h1: "Beauty & facial providers",
    intro:
      "Explore providers for facials, peels, microneedling, and skincare-forward beauty treatments — ideal for addressing skin concerns and maintaining results.",
    path: "/providers?category=beauty",
  },
  body: {
    title: "Body Contouring Providers — Med Spas | Verity",
    description:
      "Find med spas and aesthetics clinics offering body contouring, CoolSculpting, and non-surgical body treatments. Compare listed providers nationwide.",
    h1: "Body contouring providers",
    intro:
      "Browse med spas for body contouring and non-surgical body treatments. Filter by city and compare public ratings where available.",
    path: "/providers?category=body",
  },
  wellness: {
    title: "Wellness & IV Therapy Providers — Med Spas | Verity",
    description:
      "Find med spas offering wellness programs, IV therapy, peptide treatments, and NAD+ therapy. Compare listed providers nationwide.",
    h1: "Wellness & IV providers",
    intro:
      "Browse med spas for wellness services including IV therapy, vitamin drips, peptides, and functional medicine programs.",
    path: "/providers?category=wellness",
  },
  "weight-loss": {
    title: "Medical Weight Loss Providers — GLP-1 & More | Verity",
    description:
      "Find med spas and clinics offering medical weight loss, GLP-1 programs, and physician-supervised weight management nationwide.",
    h1: "Medical weight loss providers",
    intro:
      "Discover providers for physician-supervised weight loss including GLP-1, semaglutide, and medical weight management programs.",
    path: "/providers?category=weight-loss",
  },
  "hormone-therapy": {
    title: "Hormone Therapy Providers — BHRT & HRT | Verity",
    description:
      "Find med spas and wellness clinics offering hormone replacement therapy, BHRT, and hormone optimization programs nationwide.",
    h1: "Hormone therapy providers",
    intro:
      "Browse providers for bioidentical hormone therapy, testosterone replacement, and physician-supervised hormone optimization.",
    path: "/providers?category=hormone-therapy",
  },
  "hair-restoration": {
    title: "Hair Restoration Providers — PRP & Transplant | Verity",
    description:
      "Find med spas and clinics offering hair restoration, PRP hair treatments, and non-surgical hair loss solutions nationwide.",
    h1: "Hair restoration providers",
    intro:
      "Discover providers for hair restoration including PRP hair therapy, hair loss treatments, and surgical hair restoration referrals.",
    path: "/providers?category=hair-restoration",
  },
};

const TREATMENT_CATEGORIES = new Set<string>(Object.keys(TREATMENT_CATEGORY_SEO));

export function isTreatmentCategory(value: string | undefined): value is TreatmentCategory {
  return Boolean(value && TREATMENT_CATEGORIES.has(value));
}

const DEFAULT_OG_IMAGE = "/opengraph-image";

const sharedOpenGraph = {
  siteName: SITE_NAME,
  locale: "en_US" as const,
  type: "website" as const,
};

const sharedTwitter = {
  card: "summary_large_image" as const,
};

function ogImages(image?: string) {
  const src = image ?? DEFAULT_OG_IMAGE;
  return [{ url: src, width: 1200, height: 630, alt: DEFAULT_TITLE }];
}

/** Keep meta descriptions within Google's typical display length. */
export function truncateMetaDescription(text: string, maxLength = 155): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    ...sharedOpenGraph,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    images: ogImages(),
  },
  twitter: {
    ...sharedTwitter,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export function pageMetadata({
  title,
  description,
  path,
  image,
  keywords,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const trimmedDescription = truncateMetaDescription(description);

  return {
    title,
    description: trimmedDescription,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...sharedOpenGraph,
      title,
      description: trimmedDescription,
      url,
      images: ogImages(image),
    },
    twitter: {
      ...sharedTwitter,
      title,
      description: trimmedDescription,
      images: [image ?? DEFAULT_OG_IMAGE],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: true,
          },
        }
      : {}),
  };
}

const VALID_STATE_CODES = new Set(
  US_STATES.filter((state) => state.code !== "All").map((state) => state.code)
);

export const SHOP_ORIGIN_FILTER_CODES = ["US", "FR"] as const;

const SHOP_ORIGIN_FILTERS = new Set<string>(SHOP_ORIGIN_FILTER_CODES);

function normalizeStateCode(raw?: string): USStateCode | undefined {
  if (!raw?.trim()) return undefined;
  const code = raw.trim().toUpperCase();
  return VALID_STATE_CODES.has(code as USStateCode) ? (code as USStateCode) : undefined;
}

export function buildProvidersPath(filters: {
  category?: TreatmentCategory;
  state?: string;
  city?: string;
}): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.state) params.set("state", filters.state);
  if (filters.city) params.set("city", filters.city);
  const qs = params.toString();
  return qs ? `/providers?${qs}` : "/providers";
}

export function normalizeProvidersFilters(raw: {
  state?: string;
  city?: string;
  category?: string;
}): {
  category?: TreatmentCategory;
  state?: USStateCode;
  city?: string;
  noIndex: boolean;
} {
  const state = normalizeStateCode(raw.state);
  const category = isTreatmentCategory(raw.category) ? raw.category : undefined;
  const cityRaw = raw.city?.trim();
  const city = state && cityRaw ? cityRaw : undefined;

  const hadState = Boolean(raw.state?.trim());
  const hadCity = Boolean(raw.city?.trim());
  const hadCategory = Boolean(raw.category?.trim());
  const noIndex = (hadState && !state) || (hadCategory && !category) || (hadCity && !state);

  return { category, state, city, noIndex };
}

export function shopPageMetadata(origin?: string): Metadata {
  const normalizedOrigin =
    origin && SHOP_ORIGIN_FILTERS.has(origin) ? origin : undefined;
  const noIndex = Boolean(origin?.trim()) && !normalizedOrigin;
  const path = normalizedOrigin ? `/shop?origin=${normalizedOrigin}` : "/shop";

  return pageMetadata({
    title: "Skincare Shop — Derm-Recommended Products | Verity",
    description:
      "Shop derm-recommended skincare for SPF, anti-aging, acne, and post-procedure care. Luxury brands med spas trust — EltaMD, SkinCeuticals, La Roche-Posay, and more.",
    path,
    keywords: ["skincare", "skin care", "skin concerns", "SPF", "anti-aging", "medical aesthetics", "beauty"],
    noIndex,
  });
}

const PROVIDER_TYPE_LABELS: Record<Spa["providerType"], string> = {
  "med-spa": "med spa",
  "aesthetics-clinic": "aesthetics clinic",
  "dermatology-aesthetics": "dermatology practice",
};

export function getFilteredProviders(filters: {
  category?: TreatmentCategory;
  state?: USStateCode;
  city?: string;
}): Spa[] {
  let list = getSortedSpas();
  if (filters.state) list = filterSpasByState(list, filters.state);
  if (filters.city) list = filterSpasByCity(list, filters.city);
  if (filters.category) {
    list = list.filter((spa) => spa.treatmentCategories.includes(filters.category!));
  }
  return list;
}

export function providersListingLabel(filters: {
  category?: TreatmentCategory;
  state?: USStateCode;
  city?: string;
}): { h1: string; intro: string; listName: string } {
  const stateLabel = filters.state ? getStateLabel(filters.state) : undefined;
  const locationLabel = [filters.city, stateLabel].filter(Boolean).join(", ");
  const categorySeo = filters.category ? TREATMENT_CATEGORY_SEO[filters.category] : null;
  const count = getFilteredProviders(filters).length;
  const countNote = count > 0 ? `${count} listed provider${count === 1 ? "" : "s"}` : "Listed providers";

  if (categorySeo && locationLabel) {
    return {
      h1: `${categorySeo.h1} in ${locationLabel}`,
      intro: `Compare ${countNote} for ${categorySeo.h1.toLowerCase()} in ${locationLabel}. Filter by neighborhood, provider type, and public Google ratings where available.`,
      listName: `${categorySeo.h1} in ${locationLabel}`,
    };
  }

  if (categorySeo) {
    return {
      h1: categorySeo.h1,
      intro: `Compare ${countNote} nationwide for ${categorySeo.h1.toLowerCase()}. Filter by state, city, and public Google ratings where available.`,
      listName: categorySeo.h1,
    };
  }

  if (locationLabel) {
    return {
      h1: `Med spas in ${locationLabel}`,
      intro: `Browse ${countNote} in ${locationLabel} for injectables, laser treatments, facials, and skincare. Compare public ratings, treatments, and medical director info.`,
      listName: `Med spas in ${locationLabel}`,
    };
  }

  return {
    h1: "Find med spas & medical aesthetics providers",
    intro:
      "Search med spas, aesthetics clinics, and dermatology practices for injectables, laser treatments, facials, and skincare. Filter by location and treatment type — sorted by public ratings where available.",
    listName: "Med spas and medical aesthetics providers",
  };
}

export function providersPageMetadata({
  category,
  state,
  city,
}: {
  category?: TreatmentCategory;
  state?: string;
  city?: string;
} = {}): Metadata {
  const filters = normalizeProvidersFilters({ category, state, city });
  const path = buildProvidersPath(filters);
  const listing = providersListingLabel(filters);
  const stateLabel = filters.state ? getStateLabel(filters.state) : undefined;
  const locationParts = [filters.city, stateLabel].filter(Boolean);
  const locationLabel = locationParts.length > 0 ? ` in ${locationParts.join(", ")}` : "";
  const count = getFilteredProviders(filters).length;
  const countPhrase = count > 0 ? `${count} providers` : "providers";

  if (filters.category) {
    const seo = TREATMENT_CATEGORY_SEO[filters.category];
    return pageMetadata({
      title: `${seo.h1}${locationLabel} — ${countPhrase} | Verity`,
      description: truncateMetaDescription(listing.intro),
      path,
      keywords: [
        filters.category,
        "med spa",
        "medical aesthetics",
        ...(filters.state ? [getStateLabel(filters.state)] : []),
        ...(filters.city ? [filters.city] : []),
        ...(filters.category === "beauty" ? ["skincare", "facials"] : []),
        ...(filters.category === "injectables" ? ["Botox", "fillers"] : []),
        ...(filters.category === "lasers" ? ["laser treatments"] : []),
      ],
      noIndex: filters.noIndex,
    });
  }

  return pageMetadata({
    title: locationLabel
      ? `Med Spas${locationLabel} — ${countPhrase} | Verity`
      : "Find Med Spas & Medical Aesthetics Providers | Verity",
    description: truncateMetaDescription(listing.intro),
    path,
    keywords: [
      "med spa",
      "medical aesthetics",
      ...(filters.state ? [getStateLabel(filters.state)] : []),
      ...(filters.city ? [filters.city] : []),
      "injectables",
      "laser treatments",
      "skincare",
      "aesthetics clinic",
    ],
    noIndex: filters.noIndex,
  });
}

export function providerPageMetadata(spa: Spa): Metadata {
  const google = formatGoogleRating(spa);
  const ratingNote = google ? ` ${google}.` : "";
  const treatments = spa.treatments
    .slice(0, 4)
    .map((t) => t.replace("-", " "))
    .join(", ");
  const categories = spa.treatmentCategories
    .map((c) => TREATMENT_CATEGORY_SEO[c].h1.toLowerCase())
    .join(", ");
  const providerLabel = PROVIDER_TYPE_LABELS[spa.providerType];

  const description = truncateMetaDescription(
    `${spa.name} — ${providerLabel} in ${spa.neighborhood}, ${spa.city}, ${spa.state}.${ratingNote} ${spa.tagline} Offers ${categories || "aesthetic treatments"} including ${treatments}. Research on Verity.`
  );

  return pageMetadata({
    title: `${spa.name} — ${spa.city}, ${spa.state} Med Spa | Verity`,
    description,
    path: `/providers/${spa.slug}`,
    image: spa.image,
    keywords: ["med spa", "medical aesthetics", ...spa.treatmentCategories, ...spa.treatments.slice(0, 3)],
  });
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Verity Aesthetics",
    alternateName: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    knowsAbout: [
      "Medical aesthetics",
      "Med spas",
      "Skincare",
      "Injectables",
      "Laser treatments",
      "Skin concerns",
      "Beauty treatments",
    ],
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: getContactEmail(),
      url: `${SITE_URL}/contact`,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: "Verity Aesthetics",
      url: SITE_URL,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/providers?city={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

function faqPageJsonLd(questions: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

export function homeFaqJsonLd() {
  return faqPageJsonLd([
    {
      question: "What is Verity?",
      answer:
        "Verity is a curated directory of med spas, medical aesthetics clinics, and dermatology practices across the United States. We help you research injectables, laser treatments, facials, and skincare with product transparency and public ratings.",
    },
    {
      question: "How do I find a provider for injectables or laser treatments?",
      answer:
        "Browse providers by treatment type — injectables, lasers, beauty and facials, or body contouring — then filter by state and city. You can also use the AI Concierge to describe your goals and get matched to listed practices.",
    },
    {
      question: "Does Verity sell skincare products?",
      answer:
        "Yes. Verity Shop features derm-recommended skincare for daily SPF, post-procedure care, and common skin concerns — curated from brands med spas reference on our listings.",
    },
  ]);
}

export function providersFaqJsonLd() {
  return faqPageJsonLd([
    {
      question: "How do I find med spas near me on Verity?",
      answer:
        "Use the state and city filters on the providers page, or search by city name. You can also filter by treatment type — injectables, lasers, beauty and facials, or body contouring — to narrow results.",
    },
    {
      question: "What types of medical aesthetics providers are listed?",
      answer:
        "Verity lists med spas, medical aesthetics clinics, and dermatology practices that publicly offer injectables, laser treatments, facials, skincare, and body contouring across the United States.",
    },
    {
      question: "How are provider ratings shown?",
      answer:
        "Where available, listings display public Google Business ratings and review counts. Verity also accepts firsthand visit reviews submitted through our contact form for editorial review.",
    },
  ]);
}

export function howWeVerifyFaqJsonLd() {
  return faqPageJsonLd([
    {
      question: "What does Verity verify on med spa listings?",
      answer:
        "We verify business identity, location, contact details, public Google and Yelp ratings where available, official websites, social profiles, medical director names when listed publicly, and treatment categories from public sources.",
    },
    {
      question: "Does a Verity listing mean a provider is licensed?",
      answer:
        "No. A Listed badge means the business appears in our public directory from publicly sourced information. We do not independently audit state medical licenses unless explicitly noted.",
    },
    {
      question: "How can I report a listing error?",
      answer:
        "Use our contact form with the provider name, URL, and what should be corrected. We review submissions and update listings on a rolling basis.",
    },
  ]);
}

/** Individual Review schema — only for confirmed Verity visit reviews, not Google aggregates. */
export function providerReviewsJsonLd(spa: Spa, spaReviews: Review[]) {
  const verifiedReviews = spaReviews.filter((r) => r.verifiedVisit);
  if (verifiedReviews.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: spa.name,
    url: `${SITE_URL}/providers/${spa.slug}`,
    review: verifiedReviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      datePublished: r.date,
      reviewBody: r.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      ...(r.treatment ? { name: r.treatment } : {}),
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function providerBreadcrumbJsonLd(spa: Spa) {
  const items = [
    { name: "Home", path: "/" },
    { name: "Providers", path: "/providers" },
    {
      name: getStateLabel(spa.state),
      path: buildProvidersPath({ state: spa.state as USStateCode }),
    },
    {
      name: spa.city,
      path: buildProvidersPath({ state: spa.state as USStateCode, city: spa.city }),
    },
    { name: spa.name, path: `/providers/${spa.slug}` },
  ];

  return breadcrumbJsonLd(items);
}

export function providersCollectionPageJsonLd({
  path,
  name,
  description,
}: {
  path: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE_URL}${path}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

const ITEM_LIST_SCHEMA_LIMIT = 50;

export function providersItemListJsonLd({
  providers,
  path,
  listName,
}: {
  providers: Spa[];
  path: string;
  listName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    url: `${SITE_URL}${path}`,
    numberOfItems: providers.length,
    itemListElement: providers.slice(0, ITEM_LIST_SCHEMA_LIMIT).map((spa, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: spa.name,
      url: `${SITE_URL}/providers/${spa.slug}`,
    })),
  };
}

const TREATMENT_CATEGORY_SERVICES: Record<TreatmentCategory, string> = {
  injectables: "Injectables",
  lasers: "Laser treatments",
  beauty: "Facials and skincare",
  body: "Body contouring",
  wellness: "Wellness and IV therapy",
  "weight-loss": "Medical weight loss",
  "hormone-therapy": "Hormone therapy",
  "hair-restoration": "Hair restoration",
};

export function localBusinessJsonLd(spa: Spa) {
  const pageUrl = `${SITE_URL}/providers/${spa.slug}`;
  const googleRating = spa.reviewSources?.google;
  const sameAs = [spa.website, spa.socials.instagram, spa.socials.facebook, spa.socials.tiktok].filter(
    Boolean
  );
  const services = spa.treatmentCategories.map((category) => ({
    "@type": "Service",
    name: TREATMENT_CATEGORY_SERVICES[category],
    serviceType: TREATMENT_CATEGORY_SERVICES[category],
  }));

  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "@id": `${pageUrl}#business`,
    name: spa.name,
    description: spa.description,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    ...(spa.image ? { image: [spa.image] } : {}),
    telephone: spa.phone || undefined,
    priceRange: spa.priceRange,
    ...(services.length > 0 ? { hasOfferCatalog: { "@type": "OfferCatalog", itemListElement: services } } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: spa.neighborhood,
      addressLocality: spa.city,
      addressRegion: spa.state,
      addressCountry: "US",
    },
    ...(googleRating && spa.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: googleRating,
            reviewCount: spa.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

const PRODUCT_PRICE_CURRENCY = "USD";

/** Typical USD retail price by category when a product has no explicit price. */
const PRODUCT_PRICE_USD_BY_CATEGORY: Record<string, number> = {
  SPF: 39,
  Cleanser: 35,
  Serum: 98,
  Moisturizer: 68,
  Retinol: 88,
  "Eye Care": 58,
  Treatment: 75,
  "Lip Care": 24,
};

const DEFAULT_PRODUCT_PRICE_USD = 49;

function getProductOfferPrice(product: Product): number {
  if (product.price != null && product.price > 0) return product.price;
  return PRODUCT_PRICE_USD_BY_CATEGORY[product.category] ?? DEFAULT_PRODUCT_PRICE_USD;
}

/** Google recommends priceValidUntil for product offers. */
function productOfferPriceValidUntil(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().slice(0, 10);
}

function productOfferJsonLd(product: Product) {
  const sellerName =
    product.affiliatePartner === "Amazon Associates"
      ? "Amazon"
      : product.affiliatePartner ?? product.brand;

  return {
    "@type": "Offer",
    url: `${SITE_URL}/shop/${product.slug}`,
    price: getProductOfferPrice(product).toFixed(2),
    priceCurrency: PRODUCT_PRICE_CURRENCY,
    availability: "https://schema.org/InStock",
    priceValidUntil: productOfferPriceValidUntil(),
    seller: {
      "@type": "Organization",
      name: sellerName,
    },
  };
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: product.category,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    offers: productOfferJsonLd(product),
  };
}

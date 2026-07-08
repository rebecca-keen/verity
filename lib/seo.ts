import type { Metadata } from "next";
import { formatGoogleRating } from "@/lib/spa-display";
import type { Product, Spa } from "@/lib/types";

export const SITE_URL = "https://verityaesthetics.app";
export const SITE_NAME = "Verity";
export const SITE_TAGLINE = "Trusted Aesthetics & Med Spas Nationwide";

export const DEFAULT_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const DEFAULT_DESCRIPTION =
  "Find curated aesthetics clinics, med spas, and dermatology practices across the United States. Product transparency, medical director info, public ratings, and AI-powered matching by state and city.";

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
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const trimmedDescription = truncateMetaDescription(description);

  return {
    title,
    description: trimmedDescription,
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
            follow: false,
          },
        }
      : {}),
  };
}

const PROVIDER_TYPE_LABELS: Record<Spa["providerType"], string> = {
  "med-spa": "med spa",
  "aesthetics-clinic": "aesthetics clinic",
  "dermatology-aesthetics": "dermatology practice",
};

export function providerPageMetadata(spa: Spa): Metadata {
  const google = formatGoogleRating(spa);
  const ratingNote = google ? ` ${google}.` : "";
  const treatments = spa.treatments
    .slice(0, 4)
    .map((t) => t.replace("-", " "))
    .join(", ");
  const providerLabel = PROVIDER_TYPE_LABELS[spa.providerType];

  const description = truncateMetaDescription(
    `${spa.name} — ${providerLabel} in ${spa.neighborhood}, ${spa.city}, ${spa.state}.${ratingNote} ${spa.tagline} Treatments include ${treatments}. Research on Verity.`
  );

  return pageMetadata({
    title: `${spa.name} — ${spa.city}, ${spa.state} | Verity`,
    description,
    path: `/providers/${spa.slug}`,
    image: spa.image,
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
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
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

export function localBusinessJsonLd(spa: Spa) {
  const ratingValue = spa.reviewSources?.google ?? spa.rating;
  const sameAs = [spa.website, spa.socials.instagram, spa.socials.facebook, spa.socials.tiktok].filter(
    Boolean
  );

  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: spa.name,
    description: spa.description,
    url: `${SITE_URL}/providers/${spa.slug}`,
    image: spa.image,
    telephone: spa.phone || undefined,
    priceRange: spa.priceRange,
    ...(sameAs.length > 0 ? { sameAs } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: spa.city,
      addressRegion: spa.state,
      addressCountry: "US",
    },
    ...(ratingValue && spa.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue,
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

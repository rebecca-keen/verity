import type { Metadata } from "next";
import type { Product, Spa } from "@/lib/types";

export const SITE_URL = "https://verityaesthetics.app";
export const SITE_NAME = "Verity";
export const SITE_TAGLINE = "Trusted Aesthetics & Med Spas Nationwide";

export const DEFAULT_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const DEFAULT_DESCRIPTION =
  "Find curated aesthetics clinics, med spas, and dermatology practices across the United States. Product transparency, medical director info, public ratings, and AI-powered matching by state and city.";

const sharedOpenGraph = {
  siteName: SITE_NAME,
  locale: "en_US" as const,
  type: "website" as const,
};

const sharedTwitter = {
  card: "summary_large_image" as const,
};

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  },
  twitter: {
    ...sharedTwitter,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
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
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...sharedOpenGraph,
      title,
      description,
      url,
    },
    twitter: {
      ...sharedTwitter,
      title,
      description,
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
    publisher: {
      "@type": "Organization",
      name: "Verity Aesthetics",
      url: SITE_URL,
    },
  };
}

export function localBusinessJsonLd(spa: Spa) {
  const ratingValue = spa.reviewSources?.google ?? spa.rating;

  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: spa.name,
    description: spa.description,
    url: `${SITE_URL}/providers/${spa.slug}`,
    image: spa.image,
    telephone: spa.phone || undefined,
    ...(spa.website ? { sameAs: [spa.website] } : {}),
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
    ...(product.affiliateUrl
      ? {
          offers: {
            "@type": "Offer",
            url: `${SITE_URL}/shop/${product.slug}`,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

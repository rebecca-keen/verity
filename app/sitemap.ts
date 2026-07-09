import type { MetadataRoute } from "next";
import { spas } from "@/lib/data";
import { STATES_WITH_REAL_DATA } from "@/lib/nationwide-states";
import { SITE_URL, TREATMENT_CATEGORY_SEO } from "@/lib/seo";
import { POPULAR_CITY_SHORTCUTS, POPULAR_STATE_CODES } from "@/lib/spa-utils";
import { getShopProducts } from "@/lib/shop-utils";
import type { TreatmentCategory } from "@/lib/types";

/** Pre-render at build time so crawlers never hit a cold serverless import of spa data. */
export const dynamic = "force-static";
export const revalidate = 86400;

function hasSlug(slug: string | undefined): slug is string {
  return Boolean(slug?.trim());
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/providers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/concierge`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/how-we-verify`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/premium`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/for-spas`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const treatmentCategoryPages: MetadataRoute.Sitemap = (
    Object.keys(TREATMENT_CATEGORY_SEO) as TreatmentCategory[]
  ).map((category) => ({
    url: `${SITE_URL}/providers?category=${category}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const stateFilterPages: MetadataRoute.Sitemap = STATES_WITH_REAL_DATA.map((state) => ({
    url: `${SITE_URL}/providers?state=${state}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: POPULAR_STATE_CODES.includes(state) ? 0.82 : 0.75,
  }));

  const cityFilterPages: MetadataRoute.Sitemap = POPULAR_CITY_SHORTCUTS.map((shortcut) => ({
    url: `${SITE_URL}/providers?state=${shortcut.state}&city=${encodeURIComponent(shortcut.city)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryStatePages: MetadataRoute.Sitemap = POPULAR_STATE_CODES.flatMap((state) =>
    (Object.keys(TREATMENT_CATEGORY_SEO) as TreatmentCategory[]).map((category) => ({
      url: `${SITE_URL}/providers?category=${category}&state=${state}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.78,
    }))
  );

  const providerPages: MetadataRoute.Sitemap = spas
    .filter((spa) => hasSlug(spa.slug))
    .map((spa) => ({
      url: `${SITE_URL}/providers/${spa.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const shopPages: MetadataRoute.Sitemap = getShopProducts()
    .filter((product) => hasSlug(product.slug))
    .map((product) => ({
      url: `${SITE_URL}/shop/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  return [
    ...staticPages,
    ...treatmentCategoryPages,
    ...stateFilterPages,
    ...cityFilterPages,
    ...categoryStatePages,
    ...providerPages,
    ...shopPages,
  ];
}

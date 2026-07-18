import type { MetadataRoute } from "next";
import { spas } from "@/lib/data";
import { STATES_WITH_REAL_DATA } from "@/lib/nationwide-states";
import { buildProvidersPath, SHOP_ORIGIN_FILTER_CODES, SITE_URL, TREATMENT_CATEGORY_SEO } from "@/lib/seo";
import { POPULAR_CITY_SHORTCUTS, POPULAR_STATE_CODES } from "@/lib/spa-utils";
import { getShopProducts } from "@/lib/shop-utils";
import type { TreatmentCategory } from "@/lib/types";

/** Pre-render at build time so crawlers never hit a cold serverless import of spa data. */
export const dynamic = "force-static";
export const revalidate = 86400;

function hasSlug(slug: string | undefined): slug is string {
  return Boolean(slug?.trim());
}

function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

function dedupeSitemap(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const treatmentCategories = Object.keys(TREATMENT_CATEGORY_SEO) as TreatmentCategory[];

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: absoluteUrl("/providers"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/concierge"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/shop"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/how-we-verify"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/premium"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/for-spas"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const shopFilterPages: MetadataRoute.Sitemap = SHOP_ORIGIN_FILTER_CODES.map((origin) => ({
    url: absoluteUrl(`/shop?origin=${origin}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const treatmentCategoryPages: MetadataRoute.Sitemap = treatmentCategories.map((category) => ({
    url: absoluteUrl(buildProvidersPath({ category })),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const stateFilterPages: MetadataRoute.Sitemap = STATES_WITH_REAL_DATA.map((state) => ({
    url: absoluteUrl(buildProvidersPath({ state })),
    lastModified: now,
    changeFrequency: "weekly",
    priority: POPULAR_STATE_CODES.includes(state) ? 0.82 : 0.75,
  }));

  const cityFilterPages: MetadataRoute.Sitemap = POPULAR_CITY_SHORTCUTS.map((shortcut) => ({
    url: absoluteUrl(buildProvidersPath({ state: shortcut.state, city: shortcut.city })),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryStatePages: MetadataRoute.Sitemap = POPULAR_STATE_CODES.flatMap((state) =>
    treatmentCategories.map((category) => ({
      url: absoluteUrl(buildProvidersPath({ category, state })),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.78,
    }))
  );

  const providerPages: MetadataRoute.Sitemap = spas
    .filter((spa) => hasSlug(spa.slug))
    .map((spa) => ({
      url: absoluteUrl(`/providers/${spa.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const shopPages: MetadataRoute.Sitemap = getShopProducts()
    .filter((product) => hasSlug(product.slug))
    .map((product) => ({
      url: absoluteUrl(`/shop/${product.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  return dedupeSitemap([
    ...staticPages,
    ...shopFilterPages,
    ...treatmentCategoryPages,
    ...stateFilterPages,
    ...cityFilterPages,
    ...categoryStatePages,
    ...providerPages,
    ...shopPages,
  ]);
}

import type { MetadataRoute } from "next";
import { spas } from "@/lib/data";
import { buildProvidersPath, buildTreatmentPath, SHOP_ORIGIN_FILTER_CODES, SITE_URL, TREATMENT_CATEGORY_SEO } from "@/lib/seo";
import { POPULAR_STATE_CODES } from "@/lib/spa-utils";
import { buildCityPath, buildStatePath, getAllCityRoutes, getStateRoutes, MED_SPAS_BASE } from "@/lib/geo-routes";
import { getShopProducts } from "@/lib/shop-utils";
import type { TreatmentCategory } from "@/lib/types";

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

export function getSitemapEntries(): MetadataRoute.Sitemap {
  const now = new Date();
  const treatmentCategories = Object.keys(TREATMENT_CATEGORY_SEO) as TreatmentCategory[];

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: absoluteUrl("/providers"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl(MED_SPAS_BASE), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
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

  const treatmentsIndexPage: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/treatments"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
  ];

  const treatmentCategoryPages: MetadataRoute.Sitemap = treatmentCategories.map((category) => ({
    url: absoluteUrl(buildTreatmentPath(category)),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Path-based local landing pages (these replace the old /providers?state=&city=
  // query URLs, which now 308-redirect here).
  const medSpasStatePages: MetadataRoute.Sitemap = getStateRoutes().map((state) => ({
    url: absoluteUrl(buildStatePath(state.stateSlug)),
    lastModified: now,
    changeFrequency: "weekly",
    priority: POPULAR_STATE_CODES.includes(state.stateCode) ? 0.85 : 0.78,
  }));

  const medSpasCityPages: MetadataRoute.Sitemap = getAllCityRoutes().map((city) => ({
    url: absoluteUrl(buildCityPath(city.stateSlug, city.citySlug)),
    lastModified: now,
    changeFrequency: "weekly",
    priority: city.providerCount >= 5 ? 0.8 : 0.72,
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
    ...treatmentsIndexPage,
    ...treatmentCategoryPages,
    ...medSpasStatePages,
    ...medSpasCityPages,
    ...categoryStatePages,
    ...providerPages,
    ...shopPages,
  ]);
}

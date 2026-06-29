import { amazonAffiliateProducts } from "./amazon-affiliate-products";
import { products } from "./data";
import type { Product, ProductOrigin } from "./types";

const affiliateSlugs = new Set(amazonAffiliateProducts.map((p) => p.slug));

/** Product is shoppable when it has an affiliate URL or a catalog entry with ASIN. */
export function hasAffiliateLink(product: Product): boolean {
  return Boolean(product.affiliateUrl?.trim()) || affiliateSlugs.has(product.slug);
}

export function getShopProducts(): Product[] {
  return products.filter(hasAffiliateLink);
}

export function getRecommendedShopProducts(): Product[] {
  return products.filter((p) => p.recommended && hasAffiliateLink(p));
}

export function getShopProduct(slug: string): Product | undefined {
  const product = products.find((p) => p.slug === slug);
  if (!product || !hasAffiliateLink(product)) return undefined;
  return product;
}

export function getShopProductsByBrand(): { brand: string; products: Product[] }[] {
  const byBrand = new Map<string, Product[]>();
  for (const product of getShopProducts()) {
    const list = byBrand.get(product.brand) ?? [];
    list.push(product);
    byBrand.set(product.brand, list);
  }
  return [...byBrand.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([brand, brandProducts]) => ({ brand, products: brandProducts }));
}

export function filterShopProductsByOrigin(
  catalog: Product[],
  origin?: ProductOrigin
): Product[] {
  if (!origin) return catalog;
  return catalog.filter((p) => p.origin === origin);
}

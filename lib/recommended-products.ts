import type { Product } from "./types";
import { getRecommendedShopProducts, getShopProducts } from "./shop-utils";

export const RECOMMENDED_BRANDS = [
  "ALASTIN Skincare",
  "Caudalie",
  "ISDIN",
  "Revision Skincare",
  "SkinCeuticals",
  "SkinMedica",
  "La Roche-Posay",
  "EltaMD",
  "iS Clinical",
] as const;

export type RecommendedBrand = (typeof RECOMMENDED_BRANDS)[number];

export function getRecommendedProducts(): Product[] {
  return getRecommendedShopProducts();
}

export function getRecommendedProductsByBrand(): { brand: RecommendedBrand; products: Product[] }[] {
  const recommended = getRecommendedShopProducts();
  return RECOMMENDED_BRANDS.map((brand) => ({
    brand,
    products: recommended.filter((p) => p.brand === brand),
  })).filter((group) => group.products.length > 0);
}

export { getShopProducts };

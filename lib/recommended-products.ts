import { products } from "./data";
import type { Product } from "./types";

export const RECOMMENDED_BRANDS = [
  "ALASTIN Skincare",
  "ISDIN",
  "SkinCeuticals",
  "SkinMedica",
  "La Roche-Posay",
  "EltaMD",
  "iS Clinical",
] as const;

export type RecommendedBrand = (typeof RECOMMENDED_BRANDS)[number];

export function getRecommendedProducts(): Product[] {
  return products.filter((p) => p.recommended);
}

export function getRecommendedProductsByBrand(): { brand: RecommendedBrand; products: Product[] }[] {
  return RECOMMENDED_BRANDS.map((brand) => ({
    brand,
    products: products.filter((p) => p.recommended && p.brand === brand),
  })).filter((group) => group.products.length > 0);
}

import type { Spa } from "./types";

export function getGoogleRating(spa: Spa): number | undefined {
  return spa.reviewSources?.google;
}

export function formatGoogleRating(spa: Spa): string | null {
  const google = getGoogleRating(spa);
  if (google == null) return null;
  return `Google ★ ${google.toFixed(1)}`;
}

export function getListingRatingLabel(spa: Spa): string {
  return formatGoogleRating(spa) ?? `★ ${spa.rating}`;
}

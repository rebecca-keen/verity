import placesJson from "./places-data.json";

/**
 * Real location data sourced from Google Places, keyed by provider slug.
 * Populated by `node scripts/backfill-places.mjs` (see that script's header).
 *
 * This is kept as a generated overlay — separate from the hand-curated seed
 * files — so the Places backfill can be re-run idempotently without touching
 * editorial content, and so schema only ever emits *real* address/geo/hours.
 */
export interface PlaceRecord {
  streetAddress?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  /** schema.org openingHours short form, e.g. "Mo-Fr 09:00-18:00". */
  openingHours?: string[];
  googlePlaceId?: string;
  /** ISO date this record was last refreshed from Places. */
  updatedAt?: string;
}

const placesData = placesJson as Record<string, PlaceRecord>;

export function getPlaceRecord(slug: string): PlaceRecord | undefined {
  return placesData[slug];
}

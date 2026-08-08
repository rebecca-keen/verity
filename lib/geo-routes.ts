import { getSortedSpas } from "./data";
import { getStateLabel, US_STATES } from "./spa-utils";
import type { Spa, USStateCode } from "./types";

/**
 * Path-based local landing pages live at:
 *   /med-spas                      → all states
 *   /med-spas/[state]              → e.g. /med-spas/florida   (all cities in state)
 *   /med-spas/[state]/[city]       → e.g. /med-spas/florida/miami
 *
 * State slug = kebab of the full state name ("new-york"); city slug = kebab of
 * the city name ("los-angeles"). These clean, keyword-rich URLs replace the old
 * `/providers?state=&city=` query pages for indexing (those now redirect here).
 */

export const MED_SPAS_BASE = "/med-spas";

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const VALID_STATE_CODES = new Set(
  US_STATES.filter((s) => s.code !== "All").map((s) => s.code)
);

export interface CityRoute {
  stateCode: USStateCode;
  stateSlug: string;
  stateLabel: string;
  city: string;
  citySlug: string;
  providerCount: number;
}

export interface StateRoute {
  stateCode: USStateCode;
  stateSlug: string;
  stateLabel: string;
  cityCount: number;
  providerCount: number;
  cities: CityRoute[];
}

interface GeoIndex {
  stateRoutes: StateRoute[];
  stateBySlug: Map<string, StateRoute>;
  spasByKey: Map<string, Spa[]>; // `${stateCode}:${citySlug}` → sorted spas
}

let cached: GeoIndex | null = null;

function buildIndex(): GeoIndex {
  if (cached) return cached;

  const byState = new Map<USStateCode, Map<string, Spa[]>>();
  for (const spa of getSortedSpas()) {
    const code = spa.state as USStateCode;
    if (!VALID_STATE_CODES.has(code) || !spa.city?.trim()) continue;
    let cityMap = byState.get(code);
    if (!cityMap) {
      cityMap = new Map();
      byState.set(code, cityMap);
    }
    const list = cityMap.get(spa.city) ?? [];
    list.push(spa);
    cityMap.set(spa.city, list);
  }

  const stateRoutes: StateRoute[] = [];
  const stateBySlug = new Map<string, StateRoute>();
  const spasByKey = new Map<string, Spa[]>();

  for (const [code, cityMap] of byState) {
    const stateLabel = getStateLabel(code);
    const stateSlug = toSlug(stateLabel);
    const cities: CityRoute[] = [];
    let providerCount = 0;

    for (const [city, list] of cityMap) {
      const citySlug = toSlug(city);
      const key = `${code}:${citySlug}`;
      // First city to claim a slug wins (collisions within a state are rare).
      if (!spasByKey.has(key)) spasByKey.set(key, list);
      cities.push({ stateCode: code, stateSlug, stateLabel, city, citySlug, providerCount: list.length });
      providerCount += list.length;
    }

    cities.sort((a, b) => b.providerCount - a.providerCount || a.city.localeCompare(b.city));
    const route: StateRoute = {
      stateCode: code,
      stateSlug,
      stateLabel,
      cityCount: cities.length,
      providerCount,
      cities,
    };
    stateRoutes.push(route);
    stateBySlug.set(stateSlug, route);
  }

  stateRoutes.sort(
    (a, b) => b.providerCount - a.providerCount || a.stateLabel.localeCompare(b.stateLabel)
  );

  cached = { stateRoutes, stateBySlug, spasByKey };
  return cached;
}

export function getStateRoutes(): StateRoute[] {
  return buildIndex().stateRoutes;
}

export function getAllCityRoutes(): CityRoute[] {
  return buildIndex().stateRoutes.flatMap((s) => s.cities);
}

export function resolveStateRoute(stateSlug: string): StateRoute | undefined {
  return buildIndex().stateBySlug.get(stateSlug);
}

export function resolveCityRoute(
  stateSlug: string,
  citySlug: string
): { route: CityRoute; spas: Spa[] } | undefined {
  const state = resolveStateRoute(stateSlug);
  if (!state) return undefined;
  const route = state.cities.find((c) => c.citySlug === citySlug);
  if (!route) return undefined;
  const spas = buildIndex().spasByKey.get(`${state.stateCode}:${citySlug}`) ?? [];
  return { route, spas };
}

/** Nearby cities in the same state (by provider count), excluding the given city. */
export function getSiblingCities(stateSlug: string, citySlug: string, limit = 8): CityRoute[] {
  const state = resolveStateRoute(stateSlug);
  if (!state) return [];
  return state.cities.filter((c) => c.citySlug !== citySlug).slice(0, limit);
}

export function buildStatePath(stateSlug: string): string {
  return `${MED_SPAS_BASE}/${stateSlug}`;
}

export function buildCityPath(stateSlug: string, citySlug: string): string {
  return `${MED_SPAS_BASE}/${stateSlug}/${citySlug}`;
}

/** Map a state code (e.g. "FL") to its landing-page path, or null if none exists. */
export function pathForStateCode(stateCode: string): string | null {
  const route = buildIndex().stateRoutes.find((s) => s.stateCode === stateCode);
  return route ? buildStatePath(route.stateSlug) : null;
}

/** Map a state code + city name to its city landing-page path, or null if none exists. */
export function pathForCityName(stateCode: string, city: string): string | null {
  const route = buildIndex().stateRoutes.find((s) => s.stateCode === stateCode);
  if (!route) return null;
  const citySlug = toSlug(city);
  const cityRoute = route.cities.find((c) => c.citySlug === citySlug);
  return cityRoute ? buildCityPath(route.stateSlug, citySlug) : null;
}

/**
 * Where a legacy `/providers?state=&city=` URL should permanently redirect.
 * Only location-only URLs move to the new path pages; treatment-filtered URLs
 * (`?category=`) stay on /providers as faceted, still-indexable pages.
 */
export function localRedirectTarget(raw: {
  state?: string;
  city?: string;
  category?: string;
}): string | null {
  if (raw.category?.trim()) return null;
  const code = raw.state?.trim().toUpperCase();
  if (!code || !VALID_STATE_CODES.has(code as USStateCode)) return null;
  if (raw.city?.trim()) {
    return pathForCityName(code, raw.city.trim());
  }
  return pathForStateCode(code);
}

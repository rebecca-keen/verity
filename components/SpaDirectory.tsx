"use client";

import { useMemo, useState } from "react";
import { SpaCard } from "@/components/SpaCard";
import { getSortedSpas, spas } from "@/lib/data";
import {
  filterSpasByCity,
  filterSpasByState,
  getCitiesByState,
  getLocationFilterLabel,
  getNeighborhoodsByStateAndCity,
  PROVIDER_TYPE_FILTERS,
  searchSpasByText,
  US_STATES,
} from "@/lib/spa-utils";
import type { ProviderType, TreatmentCategory, USStateCode } from "@/lib/types";

const CATEGORY_FILTERS: { label: string; value: TreatmentCategory | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Injectables", value: "injectables" },
  { label: "Lasers", value: "lasers" },
  { label: "Beauty & Facials", value: "beauty" },
  { label: "Body", value: "body" },
];

export function SpaDirectory() {
  const [state, setState] = useState<USStateCode | "All">("All");
  const [city, setCity] = useState<string | "All">("All");
  const [neighborhood, setNeighborhood] = useState("All");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<TreatmentCategory | "All">("All");
  const [providerType, setProviderType] = useState<ProviderType | "All">("All");

  const sorted = getSortedSpas();

  const stateSpas = useMemo(
    () => filterSpasByState(sorted, state),
    [sorted, state]
  );

  const cities = useMemo(() => getCitiesByState(spas, state), [state]);

  const citySpas = useMemo(
    () => filterSpasByCity(stateSpas, city),
    [stateSpas, city]
  );

  const neighborhoods = useMemo(
    () => getNeighborhoodsByStateAndCity(spas, state, city),
    [state, city]
  );

  const filtered = useMemo(() => {
    let results = citySpas.filter((s) => {
      const matchArea = neighborhood === "All" || s.neighborhood === neighborhood;
      const matchCat = category === "All" || s.treatmentCategories.includes(category);
      const matchType = providerType === "All" || s.providerType === providerType;
      return matchArea && matchCat && matchType;
    });
    if (search.trim()) {
      results = searchSpasByText(results, search);
    }
    return results;
  }, [citySpas, neighborhood, category, providerType, search]);

  const locationLabel = useMemo(
    () => getLocationFilterLabel(state, city, neighborhood),
    [state, city, neighborhood]
  );

  const selectClass =
    "w-full rounded-xl border border-stone/20 bg-white px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

  return (
    <>
      <p className="mt-4 text-sm text-stone">
        Sorted by rating and review count — no paid placement in listings yet.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="state-filter" className="mb-2 block text-xs uppercase tracking-widest text-gold">
            State
          </label>
          <select
            id="state-filter"
            value={state}
            onChange={(e) => {
              setState(e.target.value as USStateCode | "All");
              setCity("All");
              setNeighborhood("All");
            }}
            className={selectClass}
          >
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city-filter" className="mb-2 block text-xs uppercase tracking-widest text-gold">
            City
          </label>
          <select
            id="city-filter"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setNeighborhood("All");
            }}
            className={selectClass}
            disabled={state === "All" && cities.length === 0}
          >
            <option value="All">All cities{state !== "All" ? ` in ${US_STATES.find((s) => s.code === state)?.label}` : ""}</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="neighborhood-filter" className="mb-2 block text-xs uppercase tracking-widest text-gold">
            Neighborhood <span className="normal-case text-stone">(optional)</span>
          </label>
          <select
            id="neighborhood-filter"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className={selectClass}
            disabled={city === "All"}
          >
            <option value="All">All neighborhoods</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search-filter" className="mb-2 block text-xs uppercase tracking-widest text-gold">
            Search
          </label>
          <input
            id="search-filter"
            type="search"
            placeholder="Provider name or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={selectClass}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {PROVIDER_TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setProviderType(f.value)}
            className={`rounded-full px-4 py-2 text-xs transition ${
              providerType === f.value
                ? "bg-charcoal text-ivory"
                : "border border-stone/20 text-stone hover:border-gold"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setCategory(f.value)}
            className={`rounded-full px-4 py-2 text-xs transition ${
              category === f.value
                ? "bg-gold/20 text-charcoal border border-gold/40"
                : "border border-stone/20 text-stone hover:border-gold"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-stone">
        Showing {filtered.length} verified providers in {locationLabel}
      </p>

      {filtered.length === 0 && (
        <p className="mt-4 text-sm text-stone">
          No providers match these filters yet. Try a nearby state or clear filters — we&apos;re expanding
          nationwide.
        </p>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((spa) => (
          <SpaCard key={spa.slug} spa={spa} />
        ))}
      </div>
    </>
  );
}

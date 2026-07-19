"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ContactLink } from "@/components/ContactLink";
import { SearchableSelect } from "@/components/SearchableSelect";
import { SpaCard } from "@/components/SpaCard";
import { getSortedSpas, spas } from "@/lib/data";
import { isPlaceholderState } from "@/lib/nationwide-states";
import {
  filterSpasByCity,
  filterSpasByState,
  getCitiesByState,
  getNeighborhoodsByStateAndCity,
  getResultsLocationLabel,
  getStateLabel,
  hasActiveFilters,
  hasActiveLocationFilters,
  parseLocationSearchParams,
  POPULAR_CITY_SHORTCUTS,
  POPULAR_STATE_CODES,
  PROVIDER_TYPE_FILTERS,
  resolveLocationFromQuery,
  searchSpasByText,
  TREATMENT_CATEGORY_FILTERS,
  US_STATES,
} from "@/lib/spa-utils";
import type { ProviderType, TreatmentCategory, USStateCode } from "@/lib/types";

const CATEGORY_FILTERS = TREATMENT_CATEGORY_FILTERS;

const PAGE_SIZE = 24;

type SpaDirectoryProps = {
  initialState?: string;
  initialCity?: string;
  initialCategory?: TreatmentCategory;
};

export function SpaDirectory({ initialState, initialCity, initialCategory }: SpaDirectoryProps) {
  const router = useRouter();
  const pathname = usePathname();

  const parsed = parseLocationSearchParams(initialState, initialCity);

  const [state, setState] = useState<USStateCode | "All">(parsed.state);
  const [city, setCity] = useState<string | "All">(parsed.city);
  const [neighborhood, setNeighborhood] = useState("All");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<TreatmentCategory | "All">(initialCategory ?? "All");
  const [providerType, setProviderType] = useState<ProviderType | "All">("All");
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const sorted = getSortedSpas();

  const stateSpas = useMemo(() => filterSpasByState(sorted, state), [sorted, state]);
  const cities = useMemo(() => getCitiesByState(spas, state), [state]);
  const citySpas = useMemo(() => filterSpasByCity(stateSpas, city), [stateSpas, city]);
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

  const visibleSpas = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const resultsLocation = useMemo(
    () => getResultsLocationLabel(state, city, neighborhood),
    [state, city, neighborhood]
  );

  const filtersActive = hasActiveFilters(state, city, neighborhood, search, category, providerType);
  const locationFiltersActive = hasActiveLocationFilters(state, city, neighborhood, search);
  const refineFiltersActive =
    neighborhood !== "All" || category !== "All" || providerType !== "All";

  const stateOptions = useMemo(
    () => [
      { value: "All", label: "All states" },
      ...US_STATES.filter((s) => s.code !== "All").map((s) => ({
        value: s.code,
        label: s.label,
      })),
    ],
    []
  );

  const cityOptions = useMemo(
    () => [
      { value: "All", label: `All cities in ${getStateLabel(state)}` },
      ...cities.map((c) => ({ value: c, label: c })),
    ],
    [cities, state]
  );

  const neighborhoodOptions = useMemo(
    () => [
      { value: "All", label: "All areas" },
      ...neighborhoods.map((n) => ({ value: n, label: n })),
    ],
    [neighborhoods]
  );

  const applyLocation = useCallback((nextState: USStateCode | "All", nextCity: string | "All") => {
    setState(nextState);
    setCity(nextCity);
    setNeighborhood("All");
  }, []);

  const resetFilters = useCallback(() => {
    setState("All");
    setCity("All");
    setNeighborhood("All");
    setSearch("");
    setCategory("All");
    setProviderType("All");
    setMoreFiltersOpen(false);
  }, []);

  useEffect(() => {
    if (state !== "All" && city !== "All" && !cities.includes(city)) {
      setCity("All");
    }
  }, [state, city, cities]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (state !== "All") params.set("state", state);
    if (city !== "All") params.set("city", city);
    if (category !== "All") params.set("category", category);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [state, city, category, pathname, router]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [state, city, neighborhood, search, category, providerType]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    const resolved = resolveLocationFromQuery(spas, value);
    if (resolved) {
      applyLocation(resolved.state, resolved.city);
      setSearch("");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const resolved = resolveLocationFromQuery(spas, search);
      if (resolved) {
        applyLocation(resolved.state, resolved.city);
        setSearch("");
      }
    }
  };

  const smallChipClass = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-xs transition ${
      active
        ? "bg-gold/20 text-charcoal border border-gold/40"
        : "border border-stone/20 text-stone hover:border-gold"
    }`;

  const filterChipClass = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-xs transition ${
      active
        ? "bg-charcoal text-ivory"
        : "border border-stone/20 text-stone hover:border-gold"
    }`;

  const stateHasNoListings = state !== "All" && stateSpas.length === 0;
  const showEmptyState = filtered.length === 0;
  const showPlaceholderStateMessage = stateHasNoListings && !search.trim();

  return (
    <>
      <div className="sticky top-[65px] z-20 -mx-6 mt-4 border-b border-stone/10 bg-ivory/95 px-6 py-3 backdrop-blur-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            <label htmlFor="location-search" className="sr-only">
              Search city or provider name
            </label>
            <input
              id="location-search"
              type="search"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search city or provider name"
              className="min-h-[40px] w-full rounded-lg border border-stone/20 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-stone/70 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          <div className="flex gap-2 md:w-auto md:shrink-0">
            <div className="min-w-0 flex-1 md:w-36">
              <SearchableSelect
                id="state-filter"
                label="State"
                value={state}
                onChange={(v) => applyLocation(v as USStateCode | "All", "All")}
                options={stateOptions}
                placeholder="State"
                compact
              />
            </div>

            <div className="min-w-0 flex-1 md:w-40">
              <SearchableSelect
                id="city-filter"
                label="City"
                value={state === "All" ? "" : city}
                onChange={(v) => {
                  setCity(v);
                  setNeighborhood("All");
                }}
                options={cityOptions}
                placeholder={state === "All" ? "Select state" : "City"}
                disabled={state === "All"}
                compact
              />
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMoreFiltersOpen((v) => !v)}
            className="inline-flex min-h-[32px] items-center gap-1.5 rounded-full border border-stone/20 px-3 py-1 text-xs text-charcoal transition hover:border-gold"
            aria-expanded={moreFiltersOpen}
            aria-controls="more-filters-panel"
          >
            More filters
            {refineFiltersActive && (
              <span className="rounded-full bg-gold/30 px-1.5 py-0.5 text-[10px] font-medium text-charcoal">
                Active
              </span>
            )}
            <svg
              className={`h-3.5 w-3.5 text-stone transition ${moreFiltersOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {filtersActive && (
            <button
              type="button"
              onClick={resetFilters}
              className="min-h-[32px] rounded-full px-3 py-1 text-xs text-stone transition hover:text-charcoal"
            >
              Reset
            </button>
          )}
        </div>

        {moreFiltersOpen && (
          <div id="more-filters-panel" className="mt-3 space-y-3 border-t border-stone/10 pt-3">
            <div>
              <p className="mb-1.5 text-xs text-stone">Popular locations</p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_STATE_CODES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => applyLocation(code, "All")}
                    className={smallChipClass(state === code && city === "All")}
                    aria-pressed={state === code && city === "All"}
                  >
                    {getStateLabel(code)}
                  </button>
                ))}
                {POPULAR_CITY_SHORTCUTS.map((shortcut) => (
                  <button
                    key={`${shortcut.state}-${shortcut.city}`}
                    type="button"
                    onClick={() => applyLocation(shortcut.state, shortcut.city)}
                    className={smallChipClass(state === shortcut.state && city === shortcut.city)}
                    aria-pressed={state === shortcut.state && city === shortcut.city}
                  >
                    {shortcut.label}
                  </button>
                ))}
              </div>
            </div>

            {state !== "All" && city !== "All" && neighborhoods.length > 0 && (
              <div className="max-w-xs">
                <SearchableSelect
                  id="neighborhood-filter"
                  label="Area"
                  value={neighborhood}
                  onChange={setNeighborhood}
                  options={neighborhoodOptions}
                  placeholder="All areas"
                  compact
                />
              </div>
            )}

            <div>
              <p className="mb-1.5 text-xs text-stone">Provider type</p>
              <div className="flex flex-wrap gap-1.5">
                {PROVIDER_TYPE_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setProviderType(f.value)}
                    className={filterChipClass(providerType === f.value)}
                    aria-pressed={providerType === f.value}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs text-stone">Treatment</p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setCategory(f.value)}
                    className={smallChipClass(category === f.value)}
                    aria-pressed={category === f.value}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-charcoal">
        {state === "All" && city === "All" ? (
          <>Showing {filtered.length} listed providers</>
        ) : (
          <>
            Showing {filtered.length} provider{filtered.length !== 1 ? "s" : ""} in{" "}
            <span className="font-medium">{resultsLocation}</span>
          </>
        )}
      </p>

      {showEmptyState && (
        <div className="mt-3 rounded-xl border border-stone/15 bg-white/60 p-4">
          {showPlaceholderStateMessage || (state !== "All" && isPlaceholderState(state)) ? (
            <>
              <p className="text-sm text-charcoal">
                We&apos;re adding providers in {getStateLabel(state)}.
              </p>
              <p className="mt-2 text-sm text-stone">
                Know a great practice?{" "}
                <ContactLink topic="Suggest a provider" subject="Suggest a provider">
                  Suggest a listing
                </ContactLink>
              </p>
            </>
          ) : locationFiltersActive ? (
            <p className="text-sm text-stone">
              No providers match these filters yet. Try a nearby city or{" "}
              <button type="button" onClick={resetFilters} className="text-gold underline-offset-2 hover:underline">
                reset filters
              </button>
              .
            </p>
          ) : (
            <p className="text-sm text-stone">
              No providers match these treatment filters.{" "}
              <button
                type="button"
                onClick={() => {
                  setCategory("All");
                  setProviderType("All");
                }}
                className="text-gold underline-offset-2 hover:underline"
              >
                Clear treatment filters
              </button>
            </p>
          )}
        </div>
      )}

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleSpas.map((spa) => (
          <SpaCard key={spa.slug} spa={spa} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            className="rounded-full border border-stone/30 px-6 py-2.5 text-sm text-charcoal transition hover:border-gold"
          >
            Load more ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </>
  );
}

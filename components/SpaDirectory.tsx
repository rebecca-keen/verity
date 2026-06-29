"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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

type SpaDirectoryProps = {
  initialState?: string;
  initialCity?: string;
};

export function SpaDirectory({ initialState, initialCity }: SpaDirectoryProps) {
  const router = useRouter();
  const pathname = usePathname();

  const parsed = parseLocationSearchParams(initialState, initialCity);

  const [state, setState] = useState<USStateCode | "All">(parsed.state);
  const [city, setCity] = useState<string | "All">(parsed.city);
  const [neighborhood, setNeighborhood] = useState("All");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<TreatmentCategory | "All">("All");
  const [providerType, setProviderType] = useState<ProviderType | "All">("All");
  const [areaExpanded, setAreaExpanded] = useState(false);

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

  const resultsLocation = useMemo(
    () => getResultsLocationLabel(state, city, neighborhood),
    [state, city, neighborhood]
  );

  const filtersActive = hasActiveFilters(state, city, neighborhood, search, category, providerType);
  const locationFiltersActive = hasActiveLocationFilters(state, city, neighborhood, search);

  const stateOptions = useMemo(
    () =>
      US_STATES.filter((s) => s.code !== "All").map((s) => ({
        value: s.code,
        label: s.label,
      })),
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
    setAreaExpanded(false);
  }, []);

  const resetFilters = useCallback(() => {
    setState("All");
    setCity("All");
    setNeighborhood("All");
    setSearch("");
    setCategory("All");
    setProviderType("All");
    setAreaExpanded(false);
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
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [state, city, pathname, router]);

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

  const chipClass = (active: boolean) =>
    `min-h-[44px] rounded-full px-4 py-2.5 text-sm transition ${
      active
        ? "bg-charcoal text-ivory"
        : "border border-stone/20 text-stone hover:border-gold hover:text-charcoal"
    }`;

  const smallChipClass = (active: boolean) =>
    `min-h-[40px] rounded-full px-3.5 py-2 text-xs transition ${
      active
        ? "bg-gold/20 text-charcoal border border-gold/40"
        : "border border-stone/20 text-stone hover:border-gold"
    }`;

  const stateHasNoListings = state !== "All" && stateSpas.length === 0;
  const showEmptyState = filtered.length === 0;
  const showPlaceholderStateMessage = stateHasNoListings && !search.trim();

  return (
    <>
      <p className="mt-4 text-sm text-stone">
        Sorted by rating and review count — no paid placement in listings yet.
      </p>

      <div className="sticky top-0 z-20 -mx-6 mt-8 border-b border-stone/10 bg-ivory/95 px-6 py-5 backdrop-blur-sm">
        <div className="space-y-5">
          <div>
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
              className="min-h-[48px] w-full rounded-xl border border-stone/20 bg-white px-4 py-3 text-base text-charcoal placeholder:text-stone/70 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
            <p className="mt-1.5 text-xs text-stone">
              Try &ldquo;Tampa&rdquo;, &ldquo;Clearwater&rdquo;, or a provider name
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-stone">Popular</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_STATE_CODES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => applyLocation(code, "All")}
                  className={chipClass(state === code && city === "All")}
                  aria-pressed={state === code && city === "All"}
                >
                  {getStateLabel(code)}
                </button>
              ))}
              <span className="hidden self-center text-stone/40 sm:inline" aria-hidden>
                ·
              </span>
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

          <div className="space-y-4">
            <div>
              <SearchableSelect
                id="state-filter"
                stepLabel="Step 1"
                label="State"
                value={state === "All" ? "" : state}
                onChange={(v) => applyLocation(v as USStateCode, "All")}
                options={stateOptions}
                placeholder="Select a state"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyLocation("All", "All")}
                  className={smallChipClass(state === "All")}
                  aria-pressed={state === "All"}
                >
                  All states
                </button>
              </div>
            </div>

            {state !== "All" && (
              <SearchableSelect
                id="city-filter"
                stepLabel="Step 2"
                label="City"
                value={city}
                onChange={(v) => {
                  setCity(v);
                  setNeighborhood("All");
                  setAreaExpanded(false);
                }}
                options={cityOptions}
                placeholder="Search cities…"
              />
            )}

            {state !== "All" && city !== "All" && neighborhoods.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setAreaExpanded((v) => !v)}
                  className="flex min-h-[44px] w-full items-center justify-between rounded-xl border border-stone/20 bg-white px-4 py-3 text-left text-sm text-charcoal transition hover:border-gold"
                  aria-expanded={areaExpanded}
                  aria-controls="area-filter-panel"
                >
                  <span>
                    <span className="mr-2 text-xs font-medium uppercase tracking-widest text-gold">
                      Step 3
                    </span>
                    <span className="text-xs uppercase tracking-widest text-stone">
                      Refine by area
                    </span>
                    {neighborhood !== "All" && (
                      <span className="ml-2 normal-case text-charcoal">· {neighborhood}</span>
                    )}
                  </span>
                  <svg
                    className={`h-4 w-4 text-stone transition ${areaExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {areaExpanded && (
                  <div id="area-filter-panel" className="mt-2">
                    <SearchableSelect
                      id="neighborhood-filter"
                      label="Neighborhood or area"
                      value={neighborhood}
                      onChange={setNeighborhood}
                      options={neighborhoodOptions}
                      placeholder="Search areas…"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {filtersActive && (
            <button
              type="button"
              onClick={resetFilters}
              className="min-h-[44px] rounded-full border border-stone/30 px-5 py-2.5 text-sm text-stone transition hover:border-gold hover:text-charcoal"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <p className="mb-1 w-full text-xs uppercase tracking-widest text-stone">Provider type</p>
        {PROVIDER_TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setProviderType(f.value)}
            className={`min-h-[44px] rounded-full px-4 py-2.5 text-xs transition ${
              providerType === f.value
                ? "bg-charcoal text-ivory"
                : "border border-stone/20 text-stone hover:border-gold"
            }`}
            aria-pressed={providerType === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <p className="mb-1 w-full text-xs uppercase tracking-widest text-stone">Treatment</p>
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setCategory(f.value)}
            className={`min-h-[44px] rounded-full px-4 py-2.5 text-xs transition ${
              category === f.value
                ? "bg-gold/20 text-charcoal border border-gold/40"
                : "border border-stone/20 text-stone hover:border-gold"
            }`}
            aria-pressed={category === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="mt-6 text-base text-charcoal">
        {state === "All" && city === "All" ? (
          <>Showing {filtered.length} verified providers</>
        ) : (
          <>
            Showing {filtered.length} provider{filtered.length !== 1 ? "s" : ""} in{" "}
            <span className="font-medium">{resultsLocation}</span>
          </>
        )}
      </p>

      {showEmptyState && (
        <div className="mt-4 rounded-xl border border-stone/15 bg-white/60 p-5">
          {showPlaceholderStateMessage || (state !== "All" && isPlaceholderState(state)) ? (
            <>
              <p className="text-sm text-charcoal">
                We&apos;re adding providers in {getStateLabel(state)}.
              </p>
              <p className="mt-2 text-sm text-stone">
                Know a great practice?{" "}
                <a href="mailto:hello@verityaesthetics.app" className="text-gold underline-offset-2 hover:underline">
                  hello@verityaesthetics.app
                </a>
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

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((spa) => (
          <SpaCard key={spa.slug} spa={spa} />
        ))}
      </div>
    </>
  );
}

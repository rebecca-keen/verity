"use client";

import { useMemo, useState } from "react";
import { SpaCard } from "@/components/SpaCard";
import { getSortedSpas, spas } from "@/lib/data";
import {
  getAreaFilterLabel,
  getAreasByCity,
  getCitiesByMetro,
  getCityFilterLabel,
  METRO_FILTERS,
  METRO_LABELS,
  PROVIDER_TYPE_FILTERS,
} from "@/lib/spa-utils";
import type { Metro, ProviderType, TreatmentCategory } from "@/lib/types";

const CATEGORY_FILTERS: { label: string; value: TreatmentCategory | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Injectables", value: "injectables" },
  { label: "Lasers", value: "lasers" },
  { label: "Beauty & Facials", value: "beauty" },
  { label: "Body", value: "body" },
];

export function SpaDirectory() {
  const [metro, setMetro] = useState<Metro | "All">("All");
  const [city, setCity] = useState<string | "All">("All");
  const [area, setArea] = useState("All");
  const [category, setCategory] = useState<TreatmentCategory | "All">("All");
  const [providerType, setProviderType] = useState<ProviderType | "All">("All");

  const sorted = getSortedSpas();

  const regionSpas = useMemo(
    () => (metro === "All" ? sorted : sorted.filter((s) => s.metro === metro)),
    [sorted, metro]
  );

  const cities = useMemo(() => getCitiesByMetro(spas, metro), [metro]);

  const citySpas = useMemo(
    () => (city === "All" ? regionSpas : regionSpas.filter((s) => s.city === city)),
    [regionSpas, city]
  );

  const areas = useMemo(() => getAreasByCity(spas, metro, city), [metro, city]);

  const filtered = citySpas.filter((s) => {
    const matchArea = area === "All" || s.neighborhood === area;
    const matchCat = category === "All" || s.treatmentCategories.includes(category);
    const matchType = providerType === "All" || s.providerType === providerType;
    return matchArea && matchCat && matchType;
  });

  const locationLabel = useMemo(() => {
    if (metro === "All") return "Florida";
    if (city === "All") return METRO_LABELS[metro];
    if (area === "All") return getCityFilterLabel(city, metro);
    return getAreaFilterLabel(area, city, metro);
  }, [metro, city, area]);

  const activeMetro = metro === "All" ? null : metro;

  return (
    <>
      <p className="mt-4 text-sm text-stone">
        Sorted by rating and review count — no paid placement in listings yet.
      </p>

      <div className="mt-6">
        <p className="mb-2 text-xs uppercase tracking-widest text-gold">Region</p>
        <div className="flex flex-wrap gap-2">
          {METRO_FILTERS.map((f) => {
            const count =
              f.value === "All" ? spas.length : spas.filter((s) => s.metro === f.value).length;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => {
                  setMetro(f.value);
                  setCity("All");
                  setArea("All");
                }}
                className={`rounded-full px-4 py-2 text-xs transition ${
                  metro === f.value
                    ? "bg-charcoal text-ivory"
                    : "border border-stone/20 text-stone hover:border-gold"
                }`}
              >
                {f.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs uppercase tracking-widest text-gold">City</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setCity("All");
              setArea("All");
            }}
            className={`rounded-full px-4 py-2 text-xs transition ${
              city === "All"
                ? "bg-charcoal text-ivory"
                : "border border-stone/20 text-stone hover:border-gold"
            }`}
          >
            All cities ({regionSpas.length})
          </button>
          {cities.map((c) => {
            const count = regionSpas.filter((s) => s.city === c).length;
            const label = activeMetro ? getCityFilterLabel(c, activeMetro) : c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCity(c);
                  setArea("All");
                }}
                className={`rounded-full px-4 py-2 text-xs transition ${
                  city === c
                    ? "bg-charcoal text-ivory"
                    : "border border-stone/20 text-stone hover:border-gold"
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs uppercase tracking-widest text-gold">Area & neighborhood</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setArea("All")}
            className={`rounded-full px-4 py-2 text-xs transition ${
              area === "All"
                ? "bg-charcoal text-ivory"
                : "border border-stone/20 text-stone hover:border-gold"
            }`}
          >
            All areas ({citySpas.length})
          </button>
          {areas.map((n) => {
            const count = citySpas.filter((s) => s.neighborhood === n).length;
            const spaForLabel = citySpas.find((s) => s.neighborhood === n);
            const label =
              activeMetro && spaForLabel
                ? getAreaFilterLabel(n, spaForLabel.city, activeMetro)
                : n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setArea(n)}
                className={`rounded-full px-4 py-2 text-xs transition ${
                  area === n
                    ? "bg-charcoal text-ivory"
                    : "border border-stone/20 text-stone hover:border-gold"
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
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

      <div className="mt-6 flex flex-wrap gap-2">
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

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((spa) => (
          <SpaCard key={spa.slug} spa={spa} />
        ))}
      </div>
    </>
  );
}

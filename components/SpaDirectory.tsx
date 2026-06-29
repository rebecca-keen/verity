"use client";

import { useState } from "react";
import { SpaCard } from "@/components/SpaCard";
import { getSortedSpas, neighborhoods, spas } from "@/lib/data";
import { PROVIDER_TYPE_FILTERS } from "@/lib/spa-utils";
import type { ProviderType, TreatmentCategory } from "@/lib/types";

const CATEGORY_FILTERS: { label: string; value: TreatmentCategory | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Injectables", value: "injectables" },
  { label: "Lasers", value: "lasers" },
  { label: "Beauty & Facials", value: "beauty" },
  { label: "Body", value: "body" },
];

export function SpaDirectory() {
  const [neighborhood, setNeighborhood] = useState("All");
  const [category, setCategory] = useState<TreatmentCategory | "All">("All");
  const [providerType, setProviderType] = useState<ProviderType | "All">("All");

  const sorted = getSortedSpas();

  const filtered = sorted.filter((s) => {
    const matchHood = neighborhood === "All" || s.neighborhood === neighborhood;
    const matchCat = category === "All" || s.treatmentCategories.includes(category);
    const matchType = providerType === "All" || s.providerType === providerType;
    return matchHood && matchCat && matchType;
  });

  return (
    <>
      <p className="mt-4 text-sm text-stone">
        Sorted by rating and review count — no paid placement in listings yet.
      </p>

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

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setNeighborhood("All")}
          className={`rounded-full px-4 py-2 text-xs transition ${
            neighborhood === "All"
              ? "bg-charcoal text-ivory"
              : "border border-stone/20 text-stone hover:border-gold"
          }`}
        >
          All Miami ({spas.length})
        </button>
        {neighborhoods.map((n) => {
          const count = spas.filter((s) => s.neighborhood === n).length;
          return (
            <button
              key={n}
              type="button"
              onClick={() => setNeighborhood(n)}
              className={`rounded-full px-4 py-2 text-xs transition ${
                neighborhood === n
                  ? "bg-charcoal text-ivory"
                  : "border border-stone/20 text-stone hover:border-gold"
              }`}
            >
              {n} ({count})
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-stone">
        Showing {filtered.length} verified providers in Greater Miami
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((spa) => (
          <SpaCard key={spa.slug} spa={spa} />
        ))}
      </div>
    </>
  );
}

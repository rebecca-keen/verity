"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchableSelect } from "@/components/SearchableSelect";
import { spas } from "@/lib/data";
import { getCitiesByState, PROVIDER_TYPE_FILTERS, TREATMENT_CATEGORY_FILTERS, US_STATES } from "@/lib/spa-utils";
import type { ConciergeFilters, ConciergeMatch, ProviderType, TreatmentCategory, USStateCode } from "@/lib/types";

const CATEGORY_FILTERS = TREATMENT_CATEGORY_FILTERS;

export function AIConcierge() {
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");
  const [matches, setMatches] = useState<ConciergeMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<USStateCode | "All">("All");
  const [city, setCity] = useState("");
  const [providerType, setProviderType] = useState<ProviderType | "All">("All");
  const [treatmentCategory, setTreatmentCategory] = useState<TreatmentCategory | "All">("All");
  const [providerName, setProviderName] = useState("");

  const cities = useMemo(() => getCitiesByState(spas, state), [state]);

  const cityOptions = useMemo(
    () => [{ value: "", label: "Any city" }, ...cities.map((c) => ({ value: c, label: c }))],
    [cities]
  );

  const stateOptions = useMemo(
    () =>
      US_STATES.filter((s) => s.code !== "All").map((s) => ({
        value: s.code,
        label: s.label,
      })),
    []
  );

  const suggestions = [
    "Lip filler in Tampa or Los Angeles",
    "Luxury laser resurfacing in New York City",
    "Affordable Botox med spa in Chicago",
    "Body contouring in Atlanta or Miami",
    "Med spa for microneedling in Dallas or Austin",
  ];

  function buildFilters(): ConciergeFilters {
    return {
      state,
      city: city.trim() || undefined,
      providerType,
      treatmentCategory,
      providerName: providerName.trim() || undefined,
    };
  }

  async function ask(text: string) {
    setQuery(text);
    setLoading(true);
    setReply("");
    setMatches([]);

    const res = await fetch("/api/concierge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: text, filters: buildFilters() }),
    });
    const data = await res.json();
    setReply(data.reply);
    setMatches(data.matches || []);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="luxury-border rounded-2xl bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs uppercase tracking-widest text-gold">AI Concierge</p>
        <h2 className="mt-2 font-serif text-2xl text-charcoal md:text-3xl">
          Tell us what you&apos;re looking for
        </h2>
        <p className="mt-2 text-sm text-stone">
          We match you to listed aesthetics clinics, med spas, and dermatology practices across the
          United States by treatment, state, city, and budget — matches listed providers from public sources.
        </p>
        <p className="mt-2 text-xs text-stone/80">
          Featured partner listings may appear when our partner program launches.
        </p>

        <div className="mt-6 rounded-xl border border-stone/10 bg-cream/40 p-4">
          <p className="text-xs font-medium uppercase tracking-widest text-stone">Refine your search</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <SearchableSelect
              id="concierge-state"
              label="State"
              value={state === "All" ? "" : state}
              options={stateOptions}
              onChange={(value) => {
                setState((value || "All") as USStateCode | "All");
                setCity("");
              }}
              placeholder="All states"
            />
            <SearchableSelect
              id="concierge-city"
              label="City"
              value={city}
              options={cityOptions}
              onChange={setCity}
              placeholder="Any city"
              disabled={state === "All"}
            />
            <label className="block text-sm">
              <span className="mb-1 block text-xs text-stone">Provider type</span>
              <select
                value={providerType}
                onChange={(e) => setProviderType(e.target.value as ProviderType | "All")}
                className="w-full rounded-full border border-stone/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold"
              >
                {PROVIDER_TYPE_FILTERS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs text-stone">Treatment category</span>
              <select
                value={treatmentCategory}
                onChange={(e) => setTreatmentCategory(e.target.value as TreatmentCategory | "All")}
                className="w-full rounded-full border border-stone/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold"
              >
                {CATEGORY_FILTERS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block text-xs text-stone">Provider name (optional)</span>
              <input
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                placeholder='e.g. "Lan Aesthetics" or "ÉLAN"'
                className="w-full rounded-full border border-stone/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-gold"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="rounded-full border border-stone/20 px-4 py-2 text-xs text-stone transition hover:border-gold hover:text-charcoal"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          className="mt-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) ask(query);
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your goals and city — e.g. lip filler in Tampa or Botox in Los Angeles"
            className="flex-1 rounded-full border border-stone/20 px-5 py-3 text-sm outline-none focus:border-gold"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-ivory disabled:opacity-50"
          >
            {loading ? "…" : "Ask"}
          </button>
        </form>

        {reply && (
          <div className="mt-8 rounded-xl bg-cream p-6">
            <p className="whitespace-pre-line text-sm leading-relaxed text-charcoal">{reply}</p>
            {matches.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {matches.map((m) => (
                  <Link
                    key={m.spaSlug}
                    href={`/providers/${m.spaSlug}`}
                    className="rounded-full border border-gold/30 bg-white px-4 py-2 text-sm text-charcoal transition hover:bg-gold/10"
                  >
                    {m.spaName} →
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

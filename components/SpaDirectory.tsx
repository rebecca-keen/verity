"use client";

import { useState } from "react";
import { SpaCard } from "@/components/SpaCard";
import { neighborhoods, spas } from "@/lib/data";

export function SpaDirectory() {
  const [neighborhood, setNeighborhood] = useState("All");

  const filtered =
    neighborhood === "All" ? spas : spas.filter((s) => s.neighborhood === neighborhood);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2">
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
        Showing {filtered.length} verified med spas in Greater Miami
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((spa) => (
          <SpaCard key={spa.slug} spa={spa} />
        ))}
      </div>
    </>
  );
}

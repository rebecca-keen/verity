"use client";

import { useState } from "react";
import Link from "next/link";
import type { ConciergeMatch } from "@/lib/types";

export function AIConcierge() {
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");
  const [matches, setMatches] = useState<ConciergeMatch[]>([]);
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "Aesthetics clinic for lip filler in Wynwood",
    "Luxury laser resurfacing in Tampa, South Tampa",
    "Affordable Botox med spa near Winter Park, Orlando",
    "Body contouring or first facial, Naples or Palm Beach",
  ];

  async function ask(text: string) {
    setQuery(text);
    setLoading(true);
    setReply("");
    setMatches([]);

    const res = await fetch("/api/concierge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: text }),
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
          We match you to verified Florida aesthetics clinics, med spas, and dermatology practices by
          treatment, metro, neighborhood, and budget — not paid ads.
        </p>

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
            placeholder="e.g. Aesthetics clinic for Botox in Coral Gables"
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
                    href={`/spas/${m.spaSlug}`}
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

import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { buildStatePath, getStateRoutes } from "@/lib/geo-routes";
import { medSpasIndexMetadata } from "@/lib/local-seo";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  const states = getStateRoutes();
  const totalProviders = states.reduce((n, s) => n + s.providerCount, 0);
  return medSpasIndexMetadata(totalProviders, states.length);
}

export default function MedSpasIndexPage() {
  const states = getStateRoutes();
  const totalProviders = states.reduce((n, s) => n + s.providerCount, 0);
  const totalCities = states.reduce((n, s) => n + s.cityCount, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Med Spas", path: "/med-spas" },
          ]),
        ]}
      />
      <p className="text-xs uppercase tracking-widest text-gold">Browse by location</p>
      <h1 className="mt-1 font-serif text-3xl text-charcoal md:text-4xl">
        Med Spas Near You — Browse by State &amp; City
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-stone">
        Explore {totalProviders} med spas and medical aesthetics providers across {states.length} states and{" "}
        {totalCities} cities. Choose a state to see providers by city, or search treatments like injectables,
        laser, facials, and body contouring.
      </p>

      <section className="mt-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {states.map((state) => (
            <Link
              key={state.stateCode}
              href={buildStatePath(state.stateSlug)}
              className="luxury-border rounded-2xl bg-white p-5 transition hover:border-gold/40"
            >
              <h2 className="font-serif text-xl text-charcoal">Med spas in {state.stateLabel}</h2>
              <p className="mt-1 text-sm text-stone">
                {state.providerCount} providers · {state.cityCount} cities
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {state.cities.slice(0, 4).map((c) => (
                  <span key={c.citySlug} className="rounded-full bg-cream px-2.5 py-1 text-xs text-charcoal">
                    {c.city}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

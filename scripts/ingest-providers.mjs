#!/usr/bin/env node
/**
 * Verity provider ingestion pipeline (stub)
 *
 * Full nationwide coverage requires a database + paid APIs — not static JSON.
 * This script documents the ingestion flow and can be extended to write seed files
 * or push rows to Postgres once a DB layer exists.
 *
 * Usage:
 *   node scripts/ingest-providers.mjs --state CA --city "Los Angeles" --dry-run
 *   node scripts/ingest-providers.mjs --help
 *
 * Required env (see .env.example):
 *   GOOGLE_PLACES_API_KEY — Google Places API (New) Text Search
 *   YELP_API_KEY          — Yelp Fusion API business search
 */

const MIN_RATING = 4.4;

const args = process.argv.slice(2);
const flags = {
  state: null,
  city: null,
  dryRun: args.includes("--dry-run"),
  help: args.includes("--help") || args.includes("-h"),
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--state" && args[i + 1]) flags.state = args[++i];
  if (args[i] === "--city" && args[i + 1]) flags.city = args[++i];
}

if (flags.help) {
  console.log(`
Verity provider ingestion (stub)

Options:
  --state <US code>   Two-letter state (e.g. CA, TX)
  --city  <name>      City filter for search queries
  --dry-run           Print planned API calls without fetching
  --help              Show this help

Data sources:
  1. Google Places API (New)
     - Text Search: "med spa" OR "medical spa" OR "aesthetics clinic" in {city}, {state}
     - Filter: place.rating >= ${MIN_RATING}
     - Fields: displayName, formattedAddress, nationalPhoneNumber, websiteUri, rating, userRatingCount
     - Docs: https://developers.google.com/maps/documentation/places/web-service/text-search

  2. Yelp Fusion API
     - GET /v3/businesses/search?term=med+spa&location={city},{state}
     - Filter: business.rating >= ${MIN_RATING}
     - Merge by normalized name + address; prefer Google phone/website when present
     - Docs: https://docs.developer.yelp.com/docs/fusion-intro

  3. RealSelf
     - No public API. Manual curation or ToS-sensitive scraping only.
     - Use for supplemental ratings / before-after galleries — not bulk ingestion.

Output format (SpaSeed / NationwideSpaSeed):
  {
    slug, name, providerType, state, neighborhood, city,
    tagline, description, rating, reviewCount,
    googleRating?, yelpRating?, phone, website,
    reviewSource, treatments, priceRange, ...
  }

Next steps for production:
  - Store in Postgres (providers, review_sources, ingestion_runs tables)
  - Dedupe by place_id / yelp id / normalized phone
  - Nightly cron re-fetch ratings; flag listings below ${MIN_RATING}
  - Human review queue before verified: true
`);
  process.exit(0);
}

const googleKey = process.env.GOOGLE_PLACES_API_KEY;
const yelpKey = process.env.YELP_API_KEY;

if (!flags.dryRun && (!googleKey || !yelpKey)) {
  console.error(
    "Missing GOOGLE_PLACES_API_KEY and/or YELP_API_KEY. Copy .env.example → .env or use --dry-run."
  );
  process.exit(1);
}

const location = [flags.city, flags.state].filter(Boolean).join(", ") || "United States";
const queries = [
  `med spa ${location}`,
  `medical spa ${location}`,
  `aesthetics clinic ${location}`,
];

console.log(`Ingestion plan for: ${location}`);
console.log(`Minimum rating: ${MIN_RATING}`);
console.log("");

for (const q of queries) {
  console.log(`Google Places Text Search: "${q}"`);
  if (!flags.dryRun) {
    console.log("  → Implement: POST places.googleapis.com/v1/places:searchText");
  }
}

console.log("");
console.log(`Yelp Fusion: term=med spa, location=${location}`);
if (!flags.dryRun) {
  console.log("  → Implement: GET api.yelp.com/v3/businesses/search");
}

console.log("");
console.log("RealSelf: manual / caution — skipped in automated pipeline.");
console.log("");
console.log(
  flags.dryRun
    ? "Dry run complete. Wire fetch + merge logic, then write to lib/nationwide-real-spas.ts or DB."
    : "Stub only — add fetch handlers and persistence before production use."
);

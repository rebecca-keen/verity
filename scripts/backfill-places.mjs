#!/usr/bin/env node
/**
 * Backfill real location data (street address, ZIP, lat/lng, opening hours) for
 * every provider from the Google Places API (New), writing the results to
 * lib/places-data.json. That file is merged into each Spa by slug in lib/data.ts,
 * so the LocalBusiness JSON-LD can emit real address/geo/hours — the foundation
 * for local / map-pack ranking.
 *
 * Setup:
 *   1. Enable "Places API (New)" in Google Cloud and create an API key.
 *   2. Put it in .env.local as:  GOOGLE_PLACES_API_KEY=your_key
 *   3. Run:  node scripts/backfill-places.mjs
 *
 * Flags:
 *   --force        Re-fetch providers that already have data.
 *   --limit N      Only process the first N providers needing data.
 *   --slug SLUG    Only process one provider (repeatable).
 *   --dry-run      Fetch + print, but don't write places-data.json.
 *   --sleep MS     Delay between API calls (default 200ms).
 *
 * The script is idempotent: re-running only fetches providers missing data
 * unless --force is passed. Cost scales with providers fetched (one call each).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_PATH = path.join(ROOT, "lib", "places-data.json");

const SEED_FILES = [
  "lib/florida-real-spas.ts",
  "lib/florida-coastal-real-spas.ts",
  "lib/tampa-bay-real-spas.ts",
  "lib/miami-metro-real-spas.ts",
  "lib/nationwide-real-spas.ts",
];

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const DRY_RUN = args.includes("--dry-run");
const LIMIT = readNumberFlag("--limit");
const SLEEP_MS = readNumberFlag("--sleep") ?? 200;
const ONLY_SLUGS = readMultiFlag("--slug");

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

function readNumberFlag(name) {
  const i = args.indexOf(name);
  if (i === -1 || i === args.length - 1) return undefined;
  const n = Number(args[i + 1]);
  return Number.isFinite(n) ? n : undefined;
}
function readMultiFlag(name) {
  const out = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === name && args[i + 1]) out.push(args[i + 1]);
  }
  return out;
}

/** Extract { slug, name, city, state, website } for every provider in the seed files. */
function parseProviders() {
  const providers = [];
  for (const rel of SEED_FILES) {
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) continue;
    const src = fs.readFileSync(file, "utf8");
    // Each provider object begins with `slug: "..."`; split on that boundary.
    const chunks = src.split(/\n\s*slug:\s*"/).slice(1);
    for (const chunk of chunks) {
      const slug = firstMatch(chunk, /^([^"]+)"/);
      if (!slug) continue;
      const name = firstMatch(chunk, /\bname:\s*"([^"]+)"/);
      const city = firstMatch(chunk, /\bcity:\s*"([^"]+)"/);
      // Florida seed files omit `state` and default to FL in data.ts.
      const state = firstMatch(chunk, /\bstate:\s*"([^"]+)"/) ?? (rel.includes("florida") || rel.includes("tampa") || rel.includes("miami") ? "FL" : "");
      const website = firstMatch(chunk, /\bwebsite:\s*"([^"]+)"/);
      if (!name || !city) continue;
      providers.push({ slug, name, city, state, website });
    }
  }
  // De-dupe by slug (seeds are de-duped the same way in data.ts).
  const bySlug = new Map();
  for (const p of providers) if (!bySlug.has(p.slug)) bySlug.set(p.slug, p);
  return [...bySlug.values()];
}

function firstMatch(str, re) {
  const m = str.match(re);
  return m ? m[1] : undefined;
}

const DAY_CODES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** Convert Places API (New) regularOpeningHours.periods → schema.org openingHours short form. */
function toSchemaOpeningHours(regularOpeningHours) {
  const periods = regularOpeningHours?.periods;
  if (!Array.isArray(periods) || periods.length === 0) return undefined;

  // Build "HH:MM-HH:MM" per weekday (0=Su..6=Sa). Skip malformed / 24h-open edge cases.
  const perDay = {};
  for (const p of periods) {
    if (!p.open || !p.close) continue;
    const day = p.open.day;
    const open = fmt(p.open.hour, p.open.minute);
    const close = fmt(p.close.hour, p.close.minute);
    if (day == null || open == null || close == null) continue;
    (perDay[day] ||= []).push(`${open}-${close}`);
  }

  // Collapse consecutive days sharing identical hours into ranges (Mo-Fr 09:00-18:00).
  const entries = [];
  let runStart = null;
  let runHours = null;
  const flush = (endDay) => {
    if (runStart == null) return;
    const label =
      runStart === endDay ? DAY_CODES[runStart] : `${DAY_CODES[runStart]}-${DAY_CODES[endDay]}`;
    entries.push(`${label} ${runHours}`);
  };
  for (let d = 0; d <= 6; d++) {
    const hours = perDay[d] ? perDay[d].join(",") : null;
    if (hours && hours === runHours) continue;
    if (runStart != null) flush(d - 1);
    runStart = hours ? d : null;
    runHours = hours;
  }
  if (runStart != null) flush(6);
  return entries.length > 0 ? entries : undefined;
}

function fmt(h, m) {
  if (typeof h !== "number") return null;
  return `${String(h).padStart(2, "0")}:${String(m ?? 0).padStart(2, "0")}`;
}

function componentValue(components, type) {
  const c = (components ?? []).find((x) => (x.types ?? []).includes(type));
  return c?.shortText ?? c?.longText;
}

async function fetchPlace(provider) {
  const textQuery = [provider.name, provider.city, provider.state, "USA"]
    .filter(Boolean)
    .join(", ");

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.addressComponents,places.location,places.regularOpeningHours,places.websiteUri",
    },
    body: JSON.stringify({ textQuery, maxResultCount: 1, languageCode: "en" }),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} for "${textQuery}": ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  const place = data.places?.[0];
  if (!place) return null;

  const streetNumber = componentValue(place.addressComponents, "street_number");
  const route = componentValue(place.addressComponents, "route");
  const streetAddress = [streetNumber, route].filter(Boolean).join(" ") || undefined;
  const postalCode = componentValue(place.addressComponents, "postal_code");

  return {
    streetAddress,
    postalCode,
    latitude: place.location?.latitude,
    longitude: place.location?.longitude,
    openingHours: toSchemaOpeningHours(place.regularOpeningHours),
    googlePlaceId: place.id,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

function pruneUndefined(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0)) out[k] = v;
  }
  return out;
}

async function main() {
  if (!API_KEY) {
    console.error(
      "ERROR: GOOGLE_PLACES_API_KEY is not set.\n" +
        "Add it to .env.local, then re-run. See the header of this file for setup steps."
    );
    process.exit(1);
  }

  const existing = fs.existsSync(OUT_PATH)
    ? JSON.parse(fs.readFileSync(OUT_PATH, "utf8"))
    : {};

  let providers = parseProviders();
  if (ONLY_SLUGS.length > 0) providers = providers.filter((p) => ONLY_SLUGS.includes(p.slug));

  let todo = providers.filter((p) => FORCE || !hasGeo(existing[p.slug]));
  if (LIMIT != null) todo = todo.slice(0, LIMIT);

  console.log(
    `Parsed ${providers.length} providers; ${todo.length} to fetch` +
      (DRY_RUN ? " (dry run)" : "") + `.`
  );

  let ok = 0;
  let miss = 0;
  let fail = 0;
  for (const [i, provider] of todo.entries()) {
    try {
      const record = await fetchPlace(provider);
      if (!record || !hasGeo(record)) {
        miss++;
        console.log(`  [${i + 1}/${todo.length}] MISS  ${provider.slug} (${provider.name})`);
      } else {
        existing[provider.slug] = pruneUndefined(record);
        ok++;
        console.log(
          `  [${i + 1}/${todo.length}] OK    ${provider.slug} → ${record.streetAddress ?? "?"}, ${record.postalCode ?? "?"}`
        );
      }
    } catch (err) {
      fail++;
      console.log(`  [${i + 1}/${todo.length}] FAIL  ${provider.slug}: ${err.message}`);
    }
    if (i < todo.length - 1) await sleep(SLEEP_MS);
  }

  if (!DRY_RUN) {
    const sorted = Object.fromEntries(Object.entries(existing).sort(([a], [b]) => a.localeCompare(b)));
    fs.writeFileSync(OUT_PATH, JSON.stringify(sorted, null, 2) + "\n");
    console.log(`\nWrote ${Object.keys(existing).length} records to ${path.relative(ROOT, OUT_PATH)}`);
  }
  console.log(`Done. ok=${ok} miss=${miss} fail=${fail}`);
}

function hasGeo(record) {
  return (
    record &&
    typeof record.latitude === "number" &&
    typeof record.longitude === "number"
  );
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

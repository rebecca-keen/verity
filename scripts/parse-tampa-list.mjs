#!/usr/bin/env node
/** Parse medicalspareviews Tampa list into seed JSON entries */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raw = fs.readFileSync(path.join(__dirname, "tampa-reviews-raw.txt"), "utf8");
const websiteMap = JSON.parse(
  fs.readFileSync(path.join(__dirname, "website-map.json"), "utf8")
);

const SKIP_NAMES = new Set(
  [
    "iConcierge Med Spa",
    "Ageless Advanced Aesthetics",
    "Revive Medical Spa LLC.",
    "Skinspirations",
    "Lueur Aesthetics",
    "Cell Renew Medical Spa Downtown",
    "Cell Renew Medical Spa",
    "Tre Medspa",
    "Arviv Medical Aesthetics Tampa",
    "4Ever Young Med Spa & Wellness Center - New Tampa",
    "4Ever Young — Tampa",
    "Simplicity Med Spa",
    "Living Young Center — Palm Harbor",
    "Living Young Center — St. Petersburg",
    "Living Young Center — Seminole",
    "Living Young Center — Odessa",
    "Olympia Aesthetics & Wellness",
    "Moraitis Plastic Surgery Med Spa",
    "Medspa Bella",
    "Aurivita Med Spa",
    "Tranquility Aesthetics & Wellness",
    "Envy Me Aesthetics",
    "Tonicity Health & Med Spa",
    "Core Wellness & MedSpa",
    "Dunedin Medical Aesthetics Spa & Laser",
    "Bloom IV Hydration & Wellness",
    "Dunedin Well Spa",
    "St. Pete Wellness Med Spa",
    "LIVIA Medical Spa & Aesthetics",
    "TAO Wellness Med Spa",
    "Erasable Med Spa",
  ].map((n) => n.toLowerCase().replace(/[^a-z0-9]/g, ""))
);

const re = /^### (.+)\n\n(.+?) ★ ([\d.]+) · (\d+) reviews/mg;
const entries = [];
let m;
while ((m = re.exec(raw)) !== null) {
  const [, name, address, ratingStr, reviewStr] = m;
  const rating = parseFloat(ratingStr);
  const reviewCount = parseInt(reviewStr, 10);
  if (rating < 4.4) continue;
  const norm = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (SKIP_NAMES.has(norm)) continue;
  const cityMatch = address.match(/,\s*([^,]+),\s*FL/i);
  const city = cityMatch ? cityMatch[1].trim() : "Tampa";
  const info = websiteMap[name] || websiteMap[norm];
  if (!info?.website) continue;
  entries.push({
    name,
    rating,
    reviewCount,
    city,
    address,
    website: info.website,
    phone: info.phone || "",
    metro: "tampa-bay",
    reviewSource: "Google Business Profile",
    ...(info.tagline ? { tagline: info.tagline } : {}),
    ...(info.medicalDirector ? { medicalDirector: info.medicalDirector } : {}),
    ...(info.providerType ? { providerType: info.providerType } : {}),
    ...(info.treatments ? { treatments: info.treatments } : {}),
  });
}

console.log(`Parsed ${entries.length} Tampa Bay entries with websites`);
const existing = JSON.parse(
  fs.readFileSync(path.join(__dirname, "metro-spa-seeds.json"), "utf8")
);
existing.tampaBay = entries;
fs.writeFileSync(
  path.join(__dirname, "metro-spa-seeds.json"),
  JSON.stringify(existing, null, 2)
);

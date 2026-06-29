#!/usr/bin/env node
/**
 * Audit spa link quality across Verity seed data.
 * Simulates seedSpa() defaults from lib/data.ts for accurate counts.
 *
 * Usage: node scripts/audit-spa-links.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const LIB = path.join(ROOT, "lib");

const PLACEHOLDER_PHONE_RE = /\b555-\d{4}\b/;
const INVALID_HOSTS = new Set(["example.com", "www.example.com", "placeholder.com", "localhost"]);

function normalizeWebsite(website) {
  const trimmed = (website ?? "").trim();
  if (!trimmed) return "";
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(withProtocol).toString();
  } catch {
    return "";
  }
}

function isSlugGeneratedWebsite(website, slug) {
  if (!website?.trim() || !slug) return false;
  try {
    const url = new URL(normalizeWebsite(website));
    const host = url.hostname.replace(/^www\./, "");
    return host === `${slug}.com`;
  } catch {
    return false;
  }
}

function isValidWebsiteUrl(website, slug) {
  const normalized = normalizeWebsite(website);
  if (!normalized) return false;
  try {
    const url = new URL(normalized);
    if (INVALID_HOSTS.has(url.hostname.toLowerCase())) return false;
    if (isSlugGeneratedWebsite(normalized, slug)) return false;
    return true;
  } catch {
    return false;
  }
}

function isPlaceholderPhone(phone) {
  if (!phone?.trim()) return true;
  return PLACEHOLDER_PHONE_RE.test(phone);
}

function extractSpaBlocks(content) {
  const blocks = [];
  const re = /\{\s*\n\s*slug:\s*"([^"]+)"/g;
  let match;
  while ((match = re.exec(content)) !== null) {
    const slug = match[1];
    const start = match.index;
    let depth = 0;
    let end = start;
    for (let i = start; i < content.length; i++) {
      if (content[i] === "{") depth++;
      if (content[i] === "}") {
        depth--;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    blocks.push({ slug, block: content.slice(start, end), file: null });
  }
  return blocks;
}

function readField(block, field) {
  const re = new RegExp(`${field}:\\s*"([^"]*)"`);
  const m = block.match(re);
  return m ? m[1] : undefined;
}

function loadSeedFiles() {
  const files = [
    "data.ts",
    "florida-real-spas.ts",
    "florida-coastal-real-spas.ts",
    "tampa-bay-real-spas.ts",
    "miami-metro-real-spas.ts",
    "florida-spa-seeds.ts",
    "additional-florida-spa-seeds.ts",
    "nationwide-real-spas.ts",
  ];

  const seeds = [];
  for (const file of files) {
    const full = path.join(LIB, file);
    if (!fs.existsSync(full)) continue;
    const content = fs.readFileSync(full, "utf8");

    if (file === "data.ts") {
      const spaSeedsMatch = content.match(/const spaSeeds: SpaSeed\[\] = \[([\s\S]*?)\n\];/);
      if (spaSeedsMatch) {
        for (const block of extractSpaBlocks(spaSeedsMatch[1])) {
          seeds.push({ ...block, file: "data.ts/spaSeeds" });
        }
      }
      continue;
    }

    if (file === "additional-florida-spa-seeds.ts") {
      seeds.push({
        slug: "(additional-florida-bulk)",
        file,
        block: "",
        bulkCount: (content.match(/slug:/g) || []).length - 1,
        website: "",
        phone: "555-placeholder",
      });
      continue;
    }

    for (const block of extractSpaBlocks(content)) {
      if (block.slug.startsWith("eltamd") || block.slug.startsWith("skinceuticals")) continue;
      seeds.push({ ...block, file });
    }
  }
  return seeds;
}

function simulateSeedSpa(seed, index) {
  const slug = seed.slug;
  const websiteRaw = seed.website ?? "";
  const website = websiteRaw.trim() || "";
  const phone = seed.phone ?? `(555) 555-${String(1000 + (index % 9000)).padStart(4, "0")}`;
  return { slug, website, phone, file: seed.file };
}

function main() {
  const rawSeeds = loadSeedFiles();
  const parsed = [];

  for (const seed of rawSeeds) {
    if (seed.slug === "(additional-florida-bulk)") {
      for (let i = 0; i < (seed.bulkCount || 0); i++) {
        parsed.push(
          simulateSeedSpa(
            { slug: `additional-florida-${i}`, website: "", phone: `(813) 555-${2000 + i}` },
            rawSeeds.length + i
          )
        );
      }
      continue;
    }

    parsed.push(
      simulateSeedSpa(
        {
          slug: seed.slug,
          website: readField(seed.block, "website"),
          phone: readField(seed.block, "phone"),
        },
        parsed.length
      )
    );
  }

  const stats = {
    total: parsed.length,
    withValidWebsite: 0,
    emptyOrInvalidWebsite: 0,
    slugGeneratedWebsite: 0,
    placeholderPhones: 0,
    withRealPhone: 0,
    connectable: 0,
  };

  const examples = {
    slugGeneratedWebsites: [],
    placeholderPhoneFeatured: [],
    validFeatured: [],
  };

  const featuredSlugs = new Set([
    "luxe-room-denver",
    "canvas-skin-nashville",
    "look-lab-med-spa-phoenix",
    "cienega-medical-west-hollywood",
    "skin-by-lovely-los-angeles",
    "skin-pharm-nashville",
    "collab-medspa-scottsdale",
    "gleam-med-spa-denver",
    "injector-5280-denver",
  ]);

  for (const spa of parsed) {
    const validWebsite = isValidWebsiteUrl(spa.website, spa.slug);
    const slugGen = isSlugGeneratedWebsite(spa.website, spa.slug);
    const placeholderPhone = isPlaceholderPhone(spa.phone);

    if (validWebsite) stats.withValidWebsite++;
    else stats.emptyOrInvalidWebsite++;
    if (slugGen) stats.slugGeneratedWebsite++;
    if (placeholderPhone) stats.placeholderPhones++;
    else stats.withRealPhone++;
    if (validWebsite || !placeholderPhone) stats.connectable++;

    if (slugGen && examples.slugGeneratedWebsites.length < 8) {
      examples.slugGeneratedWebsites.push({ slug: spa.slug, website: spa.website });
    }

    if (featuredSlugs.has(spa.slug)) {
      const row = { slug: spa.slug, website: spa.website, phone: spa.phone, validWebsite, placeholderPhone };
      if (validWebsite && !placeholderPhone) examples.validFeatured.push(row);
      else examples.placeholderPhoneFeatured.push(row);
    }
  }

  console.log("=== Verity Spa Link Audit ===\n");
  console.log("Totals");
  console.log(`  Spas:                    ${stats.total}`);
  console.log(`  Valid website URL:       ${stats.withValidWebsite}`);
  console.log(`  Empty/invalid website:   ${stats.emptyOrInvalidWebsite}`);
  console.log(`  Slug-generated website:  ${stats.slugGeneratedWebsite}`);
  console.log(`  Placeholder phones:      ${stats.placeholderPhones}`);
  console.log(`  Real phone numbers:      ${stats.withRealPhone}`);
  console.log(`  Connectable (web/phone): ${stats.connectable}`);
  console.log("\nFeatured examples (needs attention):");
  console.log(JSON.stringify(examples.placeholderPhoneFeatured, null, 2));
  console.log("\nFeatured examples (valid):");
  console.log(JSON.stringify(examples.validFeatured, null, 2));
  console.log("\nSlug-generated website samples:");
  console.log(JSON.stringify(examples.slugGeneratedWebsites, null, 2));
}

main();

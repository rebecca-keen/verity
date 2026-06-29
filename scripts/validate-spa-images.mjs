#!/usr/bin/env node
/**
 * Validate that provider gallery image hostnames match their website domain.
 * Usage: node scripts/validate-spa-images.mjs [--json]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const LIB = path.join(ROOT, "lib");
const JSON_OUT = process.argv.includes("--json");

const BAD_UNSPLASH = new Set(["photo-1571019614242-c5c5dee9f50b"]);

function rootDomain(host) {
  const h = host.replace(/^www\./, "").toLowerCase();
  const parts = h.split(".");
  if (parts.length <= 2) return h;
  return parts.slice(-2).join(".");
}

function parseSpas() {
  const bySlug = new Map();
  for (const f of fs.readdirSync(LIB).filter((x) => x.endsWith(".ts"))) {
    const content = fs.readFileSync(path.join(LIB, f), "utf8");
    const re = /slug:\s*"([^"]+)"[\s\S]*?website:\s*"([^"]+)"/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      if (!bySlug.has(m[1])) bySlug.set(m[1], { slug: m[1], website: m[2] });
    }
  }
  return bySlug;
}

function parseImageSets() {
  const sets = {};
  for (const f of fs.readdirSync(LIB).filter((x) => x.endsWith(".ts"))) {
    const content = fs.readFileSync(path.join(LIB, f), "utf8");
    for (const name of [
      "SPA_IMAGE_SETS",
      "NATIONWIDE_REAL_SPA_IMAGES",
      "FLORIDA_REAL_SPA_IMAGES",
      "FLORIDA_COASTAL_REAL_SPA_IMAGES",
      "TAMPA_BAY_REAL_SPA_IMAGES",
      "MIAMI_METRO_REAL_SPA_IMAGES",
    ]) {
      const marker = `export const ${name}`;
      const start = content.indexOf(marker);
      if (start < 0) continue;
      const valueStart = content.indexOf("> = {", start);
      const sliceFrom = valueStart >= 0 ? valueStart : content.indexOf("= {", start);
      if (sliceFrom < 0) continue;
      const entryRe = /"([a-z0-9-]+)":\s*\{[\s\S]*?hero:\s*"([^"]+)"[\s\S]*?gallery:\s*\[([\s\S]*?)\]/g;
      const slice = content.slice(sliceFrom);
      let em;
      while ((em = entryRe.exec(slice)) !== null) {
        const gallery = [...em[3].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
        sets[em[1]] = { hero: em[2], gallery };
      }
    }
  }
  return sets;
}

function isAllowed(url, website) {
  const id = url.match(/photo-[a-zA-Z0-9_-]+/)?.[0];
  if (id && BAD_UNSPLASH.has(id)) return { ok: false, reason: "bad-unsplash-gym" };

  let siteRoot = "";
  try {
    siteRoot = rootDomain(new URL(website).hostname);
  } catch {
    if (url.includes("images.unsplash.com")) return { ok: true, reason: "unsplash-no-website" };
    return { ok: false, reason: "invalid-website" };
  }

  if (url.includes("images.unsplash.com")) {
    return { ok: false, reason: "unsplash-with-website" };
  }

  let host = "";
  try {
    host = rootDomain(new URL(url).hostname);
  } catch {
    return { ok: false, reason: "invalid-url" };
  }

  if (host === siteRoot) return { ok: true, reason: "same-domain" };

  const fullUrl = url.toLowerCase();
  const siteName = siteRoot.split(".")[0];
  if (fullUrl.includes(siteRoot) || (siteName.length > 4 && fullUrl.includes(siteName))) {
    return { ok: true, reason: "domain-in-path" };
  }

  const cdnOk =
    url.includes("cdn.") ||
    url.includes("cloudfront.net") ||
    url.includes("squarespace") ||
    url.includes("wixstatic") ||
    url.includes("wsimg.com") ||
    url.includes("website-files.com") ||
    url.includes("filesafe.space") ||
    url.includes("amazonaws.com") ||
    url.includes("datocms-assets.com") ||
    url.includes("cdn-website.com") ||
    url.includes("app-sources.com") ||
    url.includes("ytimg.com") ||
    url.includes("wp.com") ||
    url.includes("rabbitloader");
  if (cdnOk) return { ok: true, reason: "known-cdn" };
  return { ok: false, reason: `domain-mismatch:${host} vs ${siteRoot}` };
}

async function checkUrl(url) {
  try {
    const r = await fetch(url, { method: "HEAD", redirect: "follow", headers: { "User-Agent": "VerityValidate/1.0" } });
    const ct = r.headers.get("content-type") || "";
    if (r.ok && (ct.startsWith("image/") || /\.(jpg|jpeg|png|webp)/i.test(url))) return r.status;
    const g = await fetch(url, { redirect: "follow", headers: { "User-Agent": "VerityValidate/1.0", Range: "bytes=0-512" } });
    return g.ok ? g.status : g.status;
  } catch {
    return 0;
  }
}

async function main() {
  const spas = parseSpas();
  const images = parseImageSets();
  const mismatches = [];
  const broken = [];
  const badUnsplash = [];
  const unsplashWithWebsite = [];

  for (const [slug, imgs] of Object.entries(images)) {
    const spa = spas.get(slug);
    const website = spa?.website ?? "";
    for (const url of [imgs.hero, ...imgs.gallery]) {
      const verdict = isAllowed(url, website);
      if (!verdict.ok) {
        mismatches.push({ slug, url, website, reason: verdict.reason });
        if (verdict.reason === "unsplash-with-website") unsplashWithWebsite.push({ slug, url });
      }
      if (url.match(/photo-[a-zA-Z0-9_-]+/) && BAD_UNSPLASH.has(url.match(/photo-[a-zA-Z0-9_-]+/)[0])) {
        badUnsplash.push({ slug, url });
      }
      const status = await checkUrl(url);
      if (status !== 200 && status !== 206) broken.push({ slug, url, status });
    }
  }

  const report = {
    providers: Object.keys(images).length,
    mismatches: mismatches.length,
    broken: broken.length,
    badUnsplash: badUnsplash.length,
    unsplashWithWebsite: unsplashWithWebsite.length,
    mismatchDetails: mismatches,
    brokenDetails: broken,
    badUnsplashDetails: badUnsplash,
    unsplashWithWebsiteDetails: unsplashWithWebsite,
  };

  if (JSON_OUT) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log(`Validated ${report.providers} providers`);
  console.log(`  Domain mismatches: ${report.mismatches}`);
  console.log(`  Unsplash with website: ${report.unsplashWithWebsite}`);
  console.log(`  Broken URLs: ${report.broken}`);
  console.log(`  Bad gym Unsplash: ${report.badUnsplash}`);
  if (mismatches.length) {
    console.log("\nFirst mismatches:");
    for (const m of mismatches.slice(0, 20)) console.log(`  ${m.slug}: ${m.reason} — ${m.url.slice(0, 80)}`);
  }
  process.exit(mismatches.length + badUnsplash.length > 0 ? 1 : 0);
}

main();

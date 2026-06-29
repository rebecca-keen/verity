#!/usr/bin/env node
/**
 * Audit and fix provider gallery images across Verity seed files.
 * Usage:
 *   node scripts/fix-spa-gallery-images.mjs --audit
 *   node scripts/fix-spa-gallery-images.mjs --fix
 *   node scripts/fix-spa-gallery-images.mjs --fix --slug luxe-room-denver
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const LIB = path.join(ROOT, "lib");

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 VerityImageFix/1.0";
const AUDIT = process.argv.includes("--audit");
const FIX = process.argv.includes("--fix");
const SLUG_FILTER = (() => {
  const i = process.argv.indexOf("--slug");
  return i >= 0 ? process.argv[i + 1] : null;
})();

/** Gym/fitness/food stock — never use for med spas */
const BAD_UNSPLASH = new Set([
  "photo-1571019614242-c5c5dee9f50b",
  "photo-1534438327276-14e5300c3a48",
  "photo-1571907480493-67b892790831",
  "photo-1517836357463-d25dfeac3438",
]);

const MEDSPA_UNSPLASH = [
  "photo-1516975080664-ed2fc6a32937",
  "photo-1570172619644-dfd03ed5d881",
  "photo-1519823551278-64ac92734fb1",
  "photo-1487412947147-5cebf100ffc2",
  "photo-1544161515-4ab6ce6db874",
  "photo-1629909613654-28e377c37b09",
  "photo-1612349317150-e413f6a5b16d",
  "photo-1522335789203-aabd1fc54bc9",
  "photo-1556228720-195a672e8a03",
  "photo-1612817288484-6f916006741a",
  "photo-1515377905703-c4788e51af15",
  "photo-1576091160399-112ba8d25d1d",
  "photo-1596178065880-2314bdb1f869",
  "photo-1600339424329-54f343114c26",
];

const CDN_HOSTS = new Set([
  "images.unsplash.com",
  "img1.wsimg.com",
  "datocms-assets.com",
  "content.app-sources.com",
  "i.ytimg.com",
]);

const SEED_FILES = [
  "nationwide-real-spas.ts",
  "florida-real-spas.ts",
  "florida-coastal-real-spas.ts",
  "tampa-bay-real-spas.ts",
  "miami-metro-real-spas.ts",
  "data.ts",
];

function rootDomain(host) {
  const h = host.replace(/^www\./, "").toLowerCase();
  const parts = h.split(".");
  if (parts.length <= 2) return h;
  return parts.slice(-2).join(".");
}

function hostnameFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function websiteRoot(website) {
  if (!website) return "";
  try {
    return rootDomain(new URL(website).hostname);
  } catch {
    return "";
  }
}

function unsplashId(url) {
  const m = url.match(/photo-[a-zA-Z0-9_-]+/);
  return m?.[0] ?? null;
}

function galUnsplash(id) {
  return `https://images.unsplash.com/${id}?w=600&h=400&fit=crop`;
}

function heroUnsplash(id) {
  return `https://images.unsplash.com/${id}?w=800&h=600&fit=crop`;
}

function hashSlug(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

function fallbackUnsplashForSlug(slug, offset = 0) {
  const idx = (hashSlug(slug) + offset) % MEDSPA_UNSPLASH.length;
  return MEDSPA_UNSPLASH[idx];
}

function parseSpasFromFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const spas = [];
  const re = /slug:\s*"([^"]+)"[\s\S]*?website:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    spas.push({ slug: m[1], website: m[2], file: path.basename(filePath) });
  }
  return spas;
}

function parseAllSpas() {
  const bySlug = new Map();
  for (const f of SEED_FILES) {
    const fp = path.join(LIB, f);
    if (!fs.existsSync(fp)) continue;
    for (const spa of parseSpasFromFile(fp)) {
      if (!bySlug.has(spa.slug)) bySlug.set(spa.slug, spa);
    }
  }
  return bySlug;
}

function parseImageBlock(content, exportName) {
  const marker = `export const ${exportName}`;
  const start = content.indexOf(marker);
  if (start < 0) return {};
  const valueStart = content.indexOf("> = {", start);
  const openBrace = valueStart >= 0 ? valueStart + 4 : content.indexOf("= {", start);
  if (openBrace < 0) return {};
  let depth = 0;
  let i = openBrace;
  const begin = i;
  for (; i < content.length; i++) {
    if (content[i] === "{") depth++;
    else if (content[i] === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  const block = content.slice(begin, i + 1);
  const images = {};
  const entryRe = /"([a-z0-9-]+)":\s*\{[\s\S]*?hero:\s*"([^"]+)"[\s\S]*?gallery:\s*\[([\s\S]*?)\][\s\S]*?source:\s*"([^"]+)"/g;
  let em;
  while ((em = entryRe.exec(block)) !== null) {
    const gallery = [...em[3].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    images[em[1]] = { hero: em[2], gallery, source: em[4] };
  }
  return images;
}

function loadAllImageSets() {
  const sets = {};
  const files = fs.readdirSync(LIB).filter((f) => f.endsWith(".ts"));
  for (const f of files) {
    const content = fs.readFileSync(path.join(LIB, f), "utf8");
    for (const name of [
      "NATIONWIDE_REAL_SPA_IMAGES",
      "FLORIDA_REAL_SPA_IMAGES",
      "FLORIDA_COASTAL_REAL_SPA_IMAGES",
      "TAMPA_BAY_REAL_SPA_IMAGES",
      "MIAMI_METRO_REAL_SPA_IMAGES",
    ]) {
      if (content.includes(`export const ${name}`)) {
        Object.assign(sets, parseImageBlock(content, name));
      }
    }
    if (f === "spa-images.ts") {
      Object.assign(sets, parseImageBlock(content, "SPA_IMAGE_SETS"));
    }
  }
  return sets;
}

function urlAllowedForWebsite(url, website) {
  if (!url) return false;
  if (url.includes("images.unsplash.com")) return true;
  const siteRoot = websiteRoot(website);
  if (!siteRoot) return false;
  const host = hostnameFromUrl(url);
  if (!host) return false;
  if (rootDomain(host) === siteRoot) return true;
  if (CDN_HOSTS.has(host)) return true;
  if (host.includes("cdn.") && host.includes(siteRoot.split(".")[0])) return true;
  if (host.endsWith(".cloudfront.net") || host.endsWith(".squarespace-cdn.com")) return true;
  if (host.endsWith(".wixstatic.com") || host.endsWith(".wp.com")) return true;
  if (host.endsWith(".website-files.com") || host.endsWith(".pcdn.co")) return true;
  if (host.includes("amazonaws.com")) return true;
  if (host.endsWith(".filesafe.space")) return true;
  return false;
}

function imageIssues(slug, images, website) {
  const issues = [];
  if (!images) {
    issues.push("missing-images");
    return issues;
  }
  const all = [images.hero, ...images.gallery].filter(Boolean);
  for (const url of all) {
    const id = unsplashId(url);
    if (id && BAD_UNSPLASH.has(id)) issues.push(`bad-unsplash:${id}`);
    if (url.includes("unsplash") && !id) issues.push("unsplash-parse-fail");
    if (!url.includes("unsplash") && website && !urlAllowedForWebsite(url, website)) {
      issues.push(`cross-domain:${hostnameFromUrl(url)}`);
    }
  }
  if (images.gallery.some((u) => u.includes("unsplash"))) issues.push("unsplash-in-gallery");
  return [...new Set(issues)];
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": UA },
    });
    const ct = res.headers.get("content-type") || "";
    if (res.ok && (ct.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif)/i.test(url))) {
      return { ok: true, status: res.status };
    }
    const g = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": UA, Range: "bytes=0-2048" },
    });
    const gct = g.headers.get("content-type") || "";
    return { ok: g.ok && gct.startsWith("image/"), status: g.status };
  } catch (e) {
    return { ok: false, status: 0, error: e.message };
  }
}

function extractOgImage(html, base) {
  const patterns = [
    /property=["']og:image(?::secure_url)?["']\s+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["']\s+property=["']og:image(?::secure_url)?["']/i,
    /name=["']twitter:image["']\s+content=["']([^"']+)["']/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) {
      try {
        return new URL(m[1], base).href;
      } catch {}
    }
  }
  return null;
}

function extractPageImages(html, base) {
  const imgs = new Set();
  const skip = /logo|icon|favicon|avatar|badge|star|google-play|apple-store|\.svg|blank\.png/i;
  for (const m of html.matchAll(
    /(?:src|data-src|data-lazy-src|data-bg|content)=["']?(https?:\/\/[^"'\s)]+\.(?:jpg|jpeg|png|webp)(?:\?[^"'\s)]*)?)/gi
  )) {
    try {
      const u = new URL(m[1].replace(/\);$/, ""), base).href;
      if (!skip.test(u)) imgs.add(u);
    } catch {}
  }
  for (const m of html.matchAll(
    /(?:src|data-src|data-lazy-src)=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi
  )) {
    try {
      const u = new URL(m[1], base).href;
      if (!skip.test(u)) imgs.add(u);
    } catch {}
  }
  return [...imgs];
}

async function fetchSiteImages(website) {
  const paths = ["", "/gallery", "/about", "/about-us", "/services"];
  const candidates = [];
  const seenHtml = new Set();

  for (const p of paths) {
    const url = new URL(p, website).href;
    try {
      const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": UA } });
      if (!res.ok) continue;
      const html = await res.text();
      if (seenHtml.has(html.slice(0, 500))) continue;
      seenHtml.add(html.slice(0, 500));
      const og = extractOgImage(html, url);
      if (og) candidates.push({ url: og, type: "og" });
      for (const u of extractPageImages(html, url)) {
        if (!candidates.some((c) => c.url === u)) candidates.push({ url: u, type: "page" });
      }
    } catch {}
  }

  const valid = [];
  for (const c of candidates) {
    if (!urlAllowedForWebsite(c.url, website)) continue;
    const check = await checkUrl(c.url);
    if (check.ok) valid.push(c);
  }
  return valid;
}

function pickImagesFromSite(valid, website) {
  const domainFiltered = valid.filter((v) => urlAllowedForWebsite(v.url, website));
  const heroEntry =
    domainFiltered.find((v) => v.type === "og") ||
    domainFiltered.find((v) => /hero|masthead|header|banner|og|desktop|scaled/i.test(v.url)) ||
    domainFiltered[0];
  const hero = heroEntry?.url;
  const gallery = domainFiltered
    .filter((v) => v.url !== hero)
    .slice(0, 4)
    .map((v) => v.url);
  return { hero, gallery };
}

function buildFallbackImages(slug, name) {
  const h = fallbackUnsplashForSlug(slug, 0);
  const g1 = fallbackUnsplashForSlug(slug, 1);
  const g2 = fallbackUnsplashForSlug(slug, 2);
  const g3 = fallbackUnsplashForSlug(slug, 3);
  return {
    hero: heroUnsplash(h),
    gallery: [galUnsplash(g1), galUnsplash(g2), galUnsplash(g3)].filter(
      (u, i, a) => a.indexOf(u) === i
    ),
    source: `Unsplash — verified med spa stock imagery (${name})`,
  };
}

async function resolveImages(slug, spa, current) {
  const website = spa?.website;
  let siteImages = null;

  if (website) {
    siteImages = await fetchSiteImages(website);
  }

  if (siteImages?.length) {
    const picked = pickImagesFromSite(siteImages, website);
    if (picked.hero) {
      const gallery =
        picked.gallery.length >= 2
          ? picked.gallery.slice(0, 4)
          : [
              ...picked.gallery,
              ...siteImages
                .map((v) => v.url)
                .filter((u) => u !== picked.hero && !picked.gallery.includes(u))
                .slice(0, 4 - picked.gallery.length),
            ];
      const host = hostnameFromUrl(website);
      return {
        hero: picked.hero,
        gallery: gallery.length ? gallery.slice(0, 4) : [picked.hero],
        source: `${spa.name} official website`,
      };
    }
  }

  if (current?.hero && !current.hero.includes("unsplash")) {
    const check = await checkUrl(current.hero);
    if (check.ok) {
      const gallery = [];
      for (const g of current.gallery || []) {
        if (g.includes("unsplash")) continue;
        const gc = await checkUrl(g);
        if (gc.ok && urlAllowedForWebsite(g, website)) gallery.push(g);
      }
      if (gallery.length < 2) {
        const fb = buildFallbackImages(slug, spa?.name || slug);
        return {
          hero: current.hero,
          gallery: gallery.length ? [...gallery, ...fb.gallery].slice(0, 4) : fb.gallery,
          source: current.source || `${spa?.name} official website`,
        };
      }
      return { hero: current.hero, gallery: gallery.slice(0, 4), source: current.source };
    }
  }

  return buildFallbackImages(slug, spa?.name || slug);
}

function formatImageEntry(slug, entry) {
  const galleryLines = entry.gallery.map((g) => `      "${g.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}",`).join("\n");
  return `  "${slug}": {
    hero: "${entry.hero.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}",
    gallery: [
${galleryLines}
    ],
    source: "${entry.source.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}",
  }`;
}

function appendNationwideImageEntry(slug, entry) {
  const filePath = path.join(LIB, "nationwide-real-spas.ts");
  let content = fs.readFileSync(filePath, "utf8");
  const blockStart = content.indexOf("export const NATIONWIDE_REAL_SPA_IMAGES");
  if (blockStart < 0) return false;
  const closeIdx = content.indexOf("};", content.indexOf("> = {", blockStart));
  if (closeIdx < 0) return false;

  const formatted = formatImageEntry(slug, entry);
  const slugRe = new RegExp(
    `"${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}":\\s*\\{[\\s\\S]*?\\},?\\n`,
    "m"
  );
  if (slugRe.test(content)) {
    content = content.replace(slugRe, `${formatted},\n`);
  } else {
    content = content.slice(0, closeIdx) + formatted + ",\n" + content.slice(closeIdx);
  }
  fs.writeFileSync(filePath, content);
  return true;
}

function replaceUnsplashInFile(filePath, slug, newImages) {
  let content = fs.readFileSync(filePath, "utf8");
  const slugRe = new RegExp(
    `"${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}":\\s*\\{[\\s\\S]*?hero:[\\s\\S]*?gallery:[\\s\\S]*?source:[\\s\\S]*?\\}`,
    "m"
  );
  if (slugRe.test(content)) {
    content = content.replace(slugRe, formatImageEntry(slug, newImages));
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

function replaceFloridaSeedIds(filePath, slug) {
  let content = fs.readFileSync(filePath, "utf8");
  const re = new RegExp(
    `"${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}":\\s*\\{[^}]+\\}`,
    "m"
  );
  const m = content.match(re);
  if (!m) return false;
  let entry = m[0];
  let changed = false;
  for (const bad of BAD_UNSPLASH) {
    if (entry.includes(bad)) {
      const repl = fallbackUnsplashForSlug(slug, BAD_UNSPLASH.size);
      entry = entry.replaceAll(bad, repl);
      changed = true;
    }
  }
  if (changed) {
    content = content.replace(re, entry);
    fs.writeFileSync(filePath, content);
  }
  return changed;
}

function replaceFallbackIds(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;
  for (const bad of BAD_UNSPLASH) {
    if (content.includes(bad)) {
      content = content.replaceAll(bad, "photo-1570172619644-dfd03ed5d881");
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(filePath, content);
  return changed;
}

function replaceSpaImagesUnsplash(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;
  for (const bad of BAD_UNSPLASH) {
    const re = new RegExp(`img\\("${bad}"\\)`, "g");
    if (re.test(content)) {
      content = content.replace(re, 'img("photo-1570172619644-dfd03ed5d881")');
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(filePath, content);
  return changed;
}

async function pool(items, fn, n = 8) {
  const out = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: n }, worker));
  return out;
}

async function main() {
  if (!AUDIT && !FIX) {
    console.error("Usage: node scripts/fix-spa-gallery-images.mjs --audit|--fix [--slug name] [--nationwide]");
    process.exit(1);
  }

  const spas = parseAllSpas();
  const imageSets = loadAllImageSets();
  let slugs = [...spas.keys()];
  if (SLUG_FILTER) slugs = slugs.filter((s) => s === SLUG_FILTER);
  if (process.argv.includes("--nationwide")) {
    const nw = parseSpasFromFile(path.join(LIB, "nationwide-real-spas.ts")).map((s) => s.slug);
    slugs = SLUG_FILTER ? slugs : [...new Set([...slugs.filter((s) => nw.includes(s)), ...Object.keys(imageSets)])];
  }
  if (process.argv.includes("--images-only")) {
    slugs = SLUG_FILTER ? slugs.filter((s) => imageSets[s]) : Object.keys(imageSets);
  }

  const auditResults = [];

  for (const slug of slugs) {
    const spa = spas.get(slug);
    const images = imageSets[slug];
    const issues = imageIssues(slug, images, spa?.website);
    let broken = [];
    if (images) {
      for (const url of [images.hero, ...images.gallery]) {
        const c = await checkUrl(url);
        if (!c.ok) broken.push({ url, status: c.status });
      }
    } else if (spa?.website) {
      issues.push("missing-images");
    }
    if (broken.length) issues.push(`broken:${broken.length}`);
    if (issues.length) auditResults.push({ slug, website: spa?.website, issues, broken, images });
  }

  console.log(`Audited ${slugs.length} providers — ${auditResults.length} with issues\n`);

  if (AUDIT) {
    for (const r of auditResults.slice(0, 50)) {
      console.log(`${r.slug}: ${r.issues.join(", ")}`);
    }
    if (auditResults.length > 50) console.log(`... and ${auditResults.length - 50} more`);
    fs.writeFileSync(
      path.join(ROOT, "scripts/gallery-audit-report.json"),
      JSON.stringify(auditResults, null, 2)
    );
    console.log(`\nWrote scripts/gallery-audit-report.json`);
    return;
  }

  const toFix = SLUG_FILTER
    ? auditResults.filter((r) => r.slug === SLUG_FILTER)
    : auditResults;

  const fixed = [];
  const updates = {};

  await pool(
    toFix,
    async (item) => {
      const spa = spas.get(item.slug);
      console.error(`Fixing ${item.slug} (${item.issues.join(", ")})...`);
      const resolved = await resolveImages(item.slug, spa, item.images);
      updates[item.slug] = resolved;
      fixed.push(item.slug);
    },
    6
  );

  const nationwidePath = path.join(LIB, "nationwide-real-spas.ts");
  let nationwideContent = fs.readFileSync(nationwidePath, "utf8");

  for (const [slug, entry] of Object.entries(updates)) {
    const isNationwide = parseSpasFromFile(nationwidePath).some((s) => s.slug === slug);
    if (isNationwide && replaceUnsplashInFile(nationwidePath, slug, entry)) continue;
    if (isNationwide && appendNationwideImageEntry(slug, entry)) continue;
    if (replaceUnsplashInFile(path.join(LIB, "spa-images.ts"), slug, entry)) continue;
    if (replaceUnsplashInFile(path.join(LIB, "florida-real-spas.ts"), slug, entry)) continue;
    if (replaceUnsplashInFile(path.join(LIB, "tampa-bay-real-spas.ts"), slug, entry)) continue;
    if (replaceUnsplashInFile(path.join(LIB, "miami-metro-real-spas.ts"), slug, entry)) continue;
    if (replaceUnsplashInFile(path.join(LIB, "florida-coastal-real-spas.ts"), slug, entry)) continue;
  }

  replaceFallbackIds(nationwidePath);
  replaceSpaImagesUnsplash(path.join(LIB, "spa-images.ts"));
  for (const slug of fixed) {
    replaceFloridaSeedIds(path.join(LIB, "florida-spa-seeds.ts"), slug);
    replaceFloridaSeedIds(path.join(LIB, "additional-florida-spa-seeds.ts"), slug);
  }

  fs.writeFileSync(
    path.join(ROOT, "scripts/gallery-fix-report.json"),
    JSON.stringify({ fixed: fixed.length, slugs: fixed, updates }, null, 2)
  );

  console.log(`Fixed ${fixed.length} provider galleries`);
  console.log(`Wrote scripts/gallery-fix-report.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

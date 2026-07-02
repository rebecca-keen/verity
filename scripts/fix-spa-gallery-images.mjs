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
const ALL = process.argv.includes("--all");
const LOGOS = process.argv.includes("--logos");
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

/** URL fragments that indicate employee/team headshots — reject these */
const HEADSHOT_URL_RE =
  /(?:^|[/_-])(?:team|staff|provider|doctor|physician|nurse|injector|about(?:-us)?|headshot|portrait|bio|employee|profile|meet-the|our-team|faculty|practitioner|expert|cutout|head-shot)(?:[/_-]|$)|(?:team|staff|provider|doctor|headshot|portrait|bio|cutout|profile)[_-]|[-_]cutout[-_.]|(?:^|[/_-])lr[-_]?(?:accent|image)[-_]?(?:cutout|medium)/i;

/** Alt text patterns that indicate employee/team photos */
const HEADSHOT_ALT_RE =
  /\b(?:meet the team|our team|staff photo|team photo|headshot|portrait|provider photo|doctor|physician|nurse|injector|employee|our experts|exceptional experts|faculty|practitioner|profile photo|team member)\b/i;

/** URL fragments that indicate treatment/service/facility imagery — prefer these */
const PREFER_URL_RE =
  /(?:treatment|service|laser|botox|filler|inject|facial|hydra|peel|microneed|gallery|testimonial|before-after|before_after|interior|lobby|spa|room|wellness|iv-therapy|iv therapy|exterior|location|device|procedure|result|rejuvenation|contour|sculpt)/i;

/** URL/filename fragments that indicate brand logos — reject as hero */
const LOGO_URL_RE =
  /(?:^|[/_-])logo(?:[._-]|$)|[-_]logo[-_.]|logo[-_]?(?:white|dark|mark|icon|full|primary|secondary)|(?:^|[/_-])brand(?:[._-]|$)/i;

/** Partner badges and non-brand marks — reject as provider logo */
const PARTNER_BADGE_LOGO_RE =
  /alle[-+]|allergan|galderma|cobrand|proud[-_]?member|member[-_]?logo|fb-icon|diamond\d|care[-_]?credit|synchrony|spacc_|\/INJECTIONS\.png/i;

function isPartnerBadgeLogo(url) {
  if (!url) return false;
  return PARTNER_BADGE_LOGO_RE.test(url);
}

const SITE_PATHS = [
  "",
  "/services",
  "/treatments",
  "/menu",
  "/gallery",
  "/testimonials",
  "/results",
  "/aesthetic-services",
  "/med-spa-services",
  "/injectablesandthreads",
  "/lasersandmicroneedling",
  "/facialservices",
  "/skincare",
  "/packages",
];

const SEED_FILES = [
  "nationwide-real-spas.ts",
  "florida-real-spas.ts",
  "florida-coastal-real-spas.ts",
  "tampa-bay-real-spas.ts",
  "miami-metro-real-spas.ts",
  "florida-spa-seeds.ts",
  "additional-florida-spa-seeds.ts",
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

function mediaKey(url) {
  if (!url) return "";
  const wix = url.match(/media\/([^/?%]+)/i);
  if (wix) return wix[1].replace(/%7E/gi, "~").split("~")[0];
  const sq = url.match(/content\/v1\/[^/]+\/([a-f0-9-]+)/i);
  if (sq) return sq[1];
  try {
    const u = new URL(url);
    return `${u.hostname}${u.pathname}`.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function isPlaceholderWebsite(website) {
  if (!website?.trim()) return true;
  return /slug\.com|example\.com|placeholder|yourwebsite|domain\.com|pending\.com/i.test(website);
}

function isValidWebsite(website) {
  if (isPlaceholderWebsite(website)) return false;
  try {
    const u = new URL(website);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function uniqueGalleryUrls(hero, gallery) {
  const seen = new Set();
  const out = [];
  for (const url of gallery || []) {
    const key = mediaKey(url);
    if (!key || key === mediaKey(hero) || seen.has(key)) continue;
    seen.add(key);
    out.push(url);
  }
  return out;
}

function fallbackUnsplashForSlug(slug, offset = 0) {
  const idx = (hashSlug(slug) + offset) % MEDSPA_UNSPLASH.length;
  return MEDSPA_UNSPLASH[idx];
}

function parseSpasFromFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const spas = [];
  const re = /slug:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?city:\s*"([^"]+)"[\s\S]*?website:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    spas.push({ slug: m[1], name: m[2], city: m[3], website: m[4], file: path.basename(filePath) });
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
    const slugEntry = em[1];
    const slugBlock = block.slice(em.index, em.index + em[0].length);
    const logoM = slugBlock.match(/logo:\s*"([^"]+)"/);
    images[slugEntry] = { hero: em[2], gallery, source: em[4], ...(logoM ? { logo: logoM[1] } : {}) };
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

function isSquareThumbUrl(url) {
  return /[-_](?:150x150|180x180|192x192|240x240|270x270|300x300|320x320|400x400|500x500)(?:\.|[-_])/i.test(url);
}

function wixDisplayDimensions(url) {
  const m = url.match(/\/(?:fill|fit)\/w_(\d+),h_(\d+)/i);
  if (m) return { w: Number(m[1]), h: Number(m[2]) };
  return null;
}

function isLikelyLogo(url, alt = "") {
  if (!url) return false;
  const combined = `${url} ${alt}`;
  if (LOGO_URL_RE.test(combined)) return true;
  if (/\.svg(?:\?|$)/i.test(url)) return true;
  const dims = wixDisplayDimensions(url);
  if (dims) {
    const { w, h } = dims;
    if (w <= 400 && h <= 220 && w / Math.max(h, 1) >= 1.2) return true;
    if (w <= 128 && h <= 128) return true;
  }
  if (/[-_](?:24x24|32x32|48x48|64x64|96x96|128x128)(?:\.|[-_]|,)/i.test(url)) return true;
  return false;
}

function isLikelyHeadshot(url, alt = "") {
  if (!url) return false;
  const combined = `${url} ${alt}`;
  if (PREFER_URL_RE.test(url) && /(?:exterior|interior|lobby|location|inject|botox|facial|hydra|laser|therapy|treatment|service|wellness|iv[-_]|peel|microneed|contour|sculpt|device|procedure)/i.test(url)) {
    return false;
  }
  if (HEADSHOT_URL_RE.test(url) || HEADSHOT_ALT_RE.test(alt)) return true;
  if (isSquareThumbUrl(url) && /(?:portrait|head|face|team|staff|provider|doctor|bio|profile|cutout)/i.test(combined)) {
    return true;
  }
  if (/Top%20provider|top-provider|top_provider|placeholder\.png/i.test(url)) return true;
  if (/[-_]cutout[-_.]|3S1A\d{4}/i.test(url)) return true;
  return false;
}

function imageScore(url, alt = "") {
  let score = 0;
  if (PREFER_URL_RE.test(url)) score += 10;
  if (PREFER_URL_RE.test(alt)) score += 5;
  if (/hero|masthead|banner|header|exterior|interior|lobby|location/i.test(url)) score += 3;
  if (isLikelyHeadshot(url, alt)) score -= 100;
  if (isLikelyLogo(url, alt)) score -= 100;
  if (isSquareThumbUrl(url)) score -= 5;
  if (/logo|icon|favicon|badge|avatar/i.test(url)) score -= 50;
  return score;
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
    if (isLikelyHeadshot(url)) issues.push("headshot-image");
    if (url === images.hero && isLikelyLogo(url)) issues.push("logo-hero");
  }
  if (images.gallery.some((u) => u.includes("unsplash"))) issues.push("unsplash-in-gallery");
  if (website && (images.hero?.includes("unsplash") || images.gallery.some((u) => u.includes("unsplash")))) {
    issues.push("unsplash-with-website");
  }
  if (website && images.source?.toLowerCase().includes("unsplash")) issues.push("unsplash-source-label");
  const uniqueGallery = uniqueGalleryUrls(images.hero, images.gallery);
  if (website && uniqueGallery.length < 2) issues.push("weak-gallery");
  if (website && isValidWebsite(website) && !images.logo) issues.push("missing-logo");
  if (images.gallery.some((u) => isLikelyLogo(u))) issues.push("logo-in-gallery");
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
  const imgs = new Map();
  const skip = /logo|icon|favicon|avatar|badge|star|google-play|apple-store|\.svg|blank\.png/i;

  function add(url, alt = "") {
    if (!url || skip.test(url) || isLikelyLogo(url, alt)) return;
    if (isLikelyHeadshot(url, alt)) return;
    const prev = imgs.get(url);
    if (!prev || alt.length > prev.alt.length) imgs.set(url, { url, alt: alt || prev?.alt || "" });
  }

  for (const m of html.matchAll(
    /<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["'][^>]*>/gi
  )) {
    const tag = m[0];
    const altM = tag.match(/\balt=["']([^"']*)["']/i);
    try {
      add(new URL(m[1], base).href, altM?.[1] || "");
    } catch {}
  }

  for (const m of html.matchAll(
    /(?:src|data-src|data-lazy-src|data-bg|content)=["']?(https?:\/\/[^"'\s)]+\.(?:jpg|jpeg|png|webp)(?:\?[^"'\s)]*)?)/gi
  )) {
    try {
      add(new URL(m[1].replace(/\);$/, ""), base).href);
    } catch {}
  }
  for (const m of html.matchAll(
    /(?:src|data-src|data-lazy-src)=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi
  )) {
    try {
      add(new URL(m[1], base).href);
    } catch {}
  }
  return [...imgs.values()];
}

function parseLinkSizes(tag) {
  const sizesM = tag.match(/sizes=["']([^"']+)["']/i);
  if (!sizesM) return 0;
  const parts = sizesM[1].split(/\s+/);
  let max = 0;
  for (const p of parts) {
    const m = p.match(/^(\d+)x(\d+)$/);
    if (m) max = Math.max(max, Number(m[1]), Number(m[2]));
  }
  return max;
}

function extractLogoCandidates(html, base) {
  const candidates = [];

  function add(url, score, kind) {
    if (!url) return;
    try {
      const abs = new URL(url, base).href;
      if (/\.(?:gif|svg)(?:\?|$)/i.test(abs) && kind !== "header-logo") return;
      candidates.push({ url: abs, score, kind });
    } catch {}
  }

  for (const m of html.matchAll(/<link[^>]+>/gi)) {
    const tag = m[0];
    if (!/rel=["'][^"']*(?:apple-touch-icon|icon|shortcut icon|mask-icon)/i.test(tag)) continue;
    const hrefM = tag.match(/href=["']([^"']+)["']/i);
    if (!hrefM) continue;
    let score = parseLinkSizes(tag);
    if (/apple-touch-icon/i.test(tag)) score += 200;
    else if (/icon/i.test(tag)) score += 100;
    add(hrefM[1], score, "link-icon");
  }

  for (const m of html.matchAll(/<img[^>]+>/gi)) {
    const tag = m[0];
    if (!/(?:class|id|alt)=["'][^"']*logo[^"']*["']/i.test(tag)) continue;
    const srcM = tag.match(/(?:src|data-src)=["']([^"']+)["']/i);
    if (!srcM) continue;
    add(srcM[1], 250, "header-logo");
  }

  for (const m of html.matchAll(/<img[^>]+>/gi)) {
    const tag = m[0];
    const srcM = tag.match(/(?:src|data-src)=["']([^"']+)["']/i);
    if (!srcM || !LOGO_URL_RE.test(tag)) continue;
    add(srcM[1], 180, "logo-img");
  }

  const og = extractOgImage(html, base);
  if (og && !isPartnerBadgeLogo(og)) add(og, isLikelyLogo(og) ? 120 : 110, "og-image");

  return candidates.sort((a, b) => b.score - a.score);
}

async function fetchSiteLogo(website) {
  const candidates = [];
  const seenHtml = new Set();

  for (const p of ["", "/"]) {
    const url = new URL(p || "", website).href;
    try {
      const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": UA } });
      if (!res.ok) continue;
      const html = await res.text();
      if (seenHtml.has(html.slice(0, 500))) continue;
      seenHtml.add(html.slice(0, 500));
      for (const c of extractLogoCandidates(html, url)) {
        if (!candidates.some((x) => mediaKey(x.url) === mediaKey(c.url))) candidates.push(c);
      }
    } catch {}
  }

  for (const c of candidates) {
    if (isPartnerBadgeLogo(c.url)) continue;
    if (!urlAllowedForWebsite(c.url, website)) continue;
    const check = await checkUrl(c.url);
    if (check.ok) return c.url;
  }

  try {
    const domain = websiteRoot(website);
    if (domain) {
      const clearbit = `https://logo.clearbit.com/${domain}`;
      const check = await checkUrl(clearbit);
      if (check.ok) return clearbit;
    }
  } catch {}

  return null;
}

async function fetchSiteImages(website) {
  const candidates = [];
  const seenHtml = new Set();

  for (const p of SITE_PATHS) {
    const url = new URL(p, website).href;
    try {
      const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": UA } });
      if (!res.ok) continue;
      const html = await res.text();
      if (seenHtml.has(html.slice(0, 500))) continue;
      seenHtml.add(html.slice(0, 500));
      const og = extractOgImage(html, url);
      if (og && !isLikelyHeadshot(og)) candidates.push({ url: og, alt: "", type: "og", score: imageScore(og) });
      for (const img of extractPageImages(html, url)) {
        if (!candidates.some((c) => c.url === img.url)) {
          candidates.push({
            url: img.url,
            alt: img.alt,
            type: "page",
            score: imageScore(img.url, img.alt),
          });
        }
      }
    } catch {}
  }

  const valid = [];
  for (const c of candidates) {
    if (isLikelyHeadshot(c.url, c.alt) || isLikelyLogo(c.url, c.alt)) continue;
    if (!urlAllowedForWebsite(c.url, website)) continue;
    const check = await checkUrl(c.url);
    if (check.ok) valid.push(c);
  }
  return valid;
}

function pickImagesFromSite(valid, website) {
  const domainFiltered = valid
    .filter(
      (v) =>
        urlAllowedForWebsite(v.url, website) &&
        !isLikelyHeadshot(v.url, v.alt) &&
        !isLikelyLogo(v.url, v.alt)
    )
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const heroEntry =
    domainFiltered.find(
      (v) =>
        PREFER_URL_RE.test(v.url) &&
        /hero|exterior|interior|lobby|location|treatment|service|photo|dsc/i.test(v.url)
    ) ||
    domainFiltered.find((v) => PREFER_URL_RE.test(v.url)) ||
    domainFiltered.find(
      (v) => /hero|masthead|header|banner|exterior|interior|lobby|location|desktop|scaled|photo|dsc/i.test(v.url)
    ) ||
    domainFiltered[0];
  const hero = heroEntry?.url;
  const heroKey = mediaKey(hero);
  const seen = new Set(heroKey ? [heroKey] : []);
  const gallery = [];
  for (const v of domainFiltered) {
    const key = mediaKey(v.url);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    gallery.push(v.url);
    if (gallery.length >= 5) break;
  }
  return { hero, gallery };
}

async function searchAlternateWebsite(name, city) {
  const q = encodeURIComponent(`${name} ${city} med spa official site`);
  try {
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${q}`, {
      headers: { "User-Agent": UA },
    });
    if (!res.ok) return null;
    const html = await res.text();
    for (const m of html.matchAll(/uddg=([^&"]+)/g)) {
      try {
        const url = decodeURIComponent(m[1]);
        if (!isValidWebsite(url)) continue;
        if (/facebook|instagram|yelp|google\.|healthgrades|realself|vitals|zocdoc|linkedin|twitter|tiktok|youtube|mapquest|yellowpages|bbb\.org/i.test(url)) {
          continue;
        }
        return url;
      } catch {}
    }
  } catch {}
  return null;
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
    source: `Unsplash — med spa stock imagery (${name})`,
  };
}

function businessSource(spa) {
  return `${spa?.name || "Provider"} official website — services`;
}

function isStockImageUrl(url) {
  return url.includes("images.unsplash.com") || /unsplash-image/i.test(url);
}

function stripUnsplash(urls) {
  return urls.filter((u) => u && !isStockImageUrl(u));
}

async function resolveImages(slug, spa, current) {
  let website = spa?.website;
  const source = businessSource(spa);

  if (!isValidWebsite(website)) {
    return buildFallbackImages(slug, spa?.name || slug);
  }

  let siteImages = await fetchSiteImages(website);
  if (!siteImages?.length && spa?.name && spa?.city) {
    const alt = await searchAlternateWebsite(spa.name, spa.city);
    if (alt && alt !== website) {
      website = alt;
      siteImages = await fetchSiteImages(website);
    }
  }

  if (siteImages?.length) {
    const picked = pickImagesFromSite(siteImages, website);
    if (picked.hero) {
      let gallery = uniqueGalleryUrls(picked.hero, picked.gallery);
      if (gallery.length < 2) {
        for (const v of siteImages) {
          const key = mediaKey(v.url);
          if (!key || key === mediaKey(picked.hero) || gallery.some((g) => mediaKey(g) === key)) continue;
          gallery.push(v.url);
          if (gallery.length >= 4) break;
        }
      }
      gallery = uniqueGalleryUrls(picked.hero, gallery).slice(0, 4);
      return {
        hero: picked.hero,
        gallery: gallery.length >= 2 ? gallery : gallery.length ? gallery : [],
        source,
      };
    }
  }

  if (current?.hero && !isStockImageUrl(current.hero)) {
    const check = await checkUrl(current.hero);
    if (
      check.ok &&
      urlAllowedForWebsite(current.hero, website) &&
      !isLikelyHeadshot(current.hero) &&
      !isLikelyLogo(current.hero)
    ) {
      const gallery = [];
      for (const g of stripUnsplash(current.gallery || [])) {
        if (isLikelyHeadshot(g)) continue;
        const gc = await checkUrl(g);
        if (gc.ok && urlAllowedForWebsite(g, website)) gallery.push(g);
      }
      const unique = uniqueGalleryUrls(current.hero, gallery).slice(0, 4);
      if (unique.length >= 2) {
        return { hero: current.hero, gallery: unique, source };
      }
    }
  }

  return {
    hero: current?.hero && !isStockImageUrl(current.hero) ? current.hero : "",
    gallery: [],
    source,
  };
}

function formatImageEntry(slug, entry) {
  const galleryLines = entry.gallery.map((g) => `      "${g.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}",`).join("\n");
  const logoLine = entry.logo
    ? `\n    logo: "${entry.logo.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}",`
    : "";
  return `  "${slug}": {
    hero: "${entry.hero.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}",${logoLine}
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

function appendSpaImagesEntry(slug, entry) {
  const filePath = path.join(LIB, "spa-images.ts");
  let content = fs.readFileSync(filePath, "utf8");
  const blockStart = content.indexOf("export const SPA_IMAGE_SETS");
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

function appendWebsiteFetchedEntry(slug, entry) {
  const filePath = path.join(LIB, "website-fetched-spa-images.ts");
  let content = fs.readFileSync(filePath, "utf8");
  const formatted = formatImageEntry(slug, entry);
  const slugRe = new RegExp(
    `"${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}":\\s*\\{[\\s\\S]*?\\},?\\n`,
    "m"
  );
  if (slugRe.test(content)) {
    content = content.replace(slugRe, `${formatted},\n`);
  } else if (content.includes("> = {};")) {
    content = content.replace("> = {};", `> = {\n${formatted},\n};`);
  } else {
    const closeIdx = content.lastIndexOf("};");
    content = content.slice(0, closeIdx) + formatted + ",\n" + content.slice(closeIdx);
  }
  fs.writeFileSync(filePath, content);
  return true;
}

function removeFloridaSeedImageId(filePath, slug) {
  let content = fs.readFileSync(filePath, "utf8");
  const exportName = filePath.includes("additional") ? "ADDITIONAL_FLORIDA_SPA_IMAGE_IDS" : "FLORIDA_SPA_IMAGE_IDS";
  if (!content.includes(exportName)) return false;
  const slugRe = new RegExp(
    `\\s*"${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}":\\s*\\{[^}]+\\},?\\n`,
    "m"
  );
  if (!slugRe.test(content)) return false;
  content = content.replace(slugRe, "\n");
  fs.writeFileSync(filePath, content);
  return true;
}

function writeImageEntry(slug, entry) {
  const nationwidePath = path.join(LIB, "nationwide-real-spas.ts");
  const isNationwide = parseSpasFromFile(nationwidePath).some((s) => s.slug === slug);
  if (isNationwide && replaceUnsplashInFile(nationwidePath, slug, entry)) return true;
  if (isNationwide && appendNationwideImageEntry(slug, entry)) return true;
  if (replaceUnsplashInFile(path.join(LIB, "florida-real-spas.ts"), slug, entry)) return true;
  if (replaceUnsplashInFile(path.join(LIB, "tampa-bay-real-spas.ts"), slug, entry)) return true;
  if (replaceUnsplashInFile(path.join(LIB, "miami-metro-real-spas.ts"), slug, entry)) return true;
  if (replaceUnsplashInFile(path.join(LIB, "florida-coastal-real-spas.ts"), slug, entry)) return true;
  if (replaceUnsplashInFile(path.join(LIB, "spa-images.ts"), slug, entry)) return true;
  if (appendWebsiteFetchedEntry(slug, entry)) {
    removeFloridaSeedImageId(path.join(LIB, "florida-spa-seeds.ts"), slug);
    removeFloridaSeedImageId(path.join(LIB, "additional-florida-spa-seeds.ts"), slug);
    return true;
  }
  return false;
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
    console.error("Usage: node scripts/fix-spa-gallery-images.mjs --audit|--fix [--all] [--slug name] [--nationwide]");
    process.exit(1);
  }

  const spas = parseAllSpas();
  const imageSets = loadAllImageSets();
  let slugs = [...spas.keys()];
  if (SLUG_FILTER) slugs = slugs.filter((s) => s === SLUG_FILTER);
  if (ALL && !SLUG_FILTER) {
    slugs = slugs.filter((s) => isValidWebsite(spas.get(s)?.website));
  }
  if (process.argv.includes("--nationwide")) {
    const nw = parseSpasFromFile(path.join(LIB, "nationwide-real-spas.ts")).map((s) => s.slug);
    slugs = SLUG_FILTER ? slugs : [...new Set([...slugs.filter((s) => nw.includes(s)), ...Object.keys(imageSets)])];
  }
  if (process.argv.includes("--images-only")) {
    slugs = SLUG_FILTER ? slugs.filter((s) => imageSets[s]) : Object.keys(imageSets);
  }
  if (process.argv.includes("--headshots")) {
    slugs = slugs.filter((s) => {
      const imgs = imageSets[s];
      if (!imgs) return false;
      return [imgs.hero, ...imgs.gallery].some((u) => isLikelyHeadshot(u));
    });
  }
  if (process.argv.includes("--phoenix-az")) {
    slugs = slugs.filter((s) => {
      const spa = spas.get(s);
      const blob = `${spa?.city || ""} ${spa?.neighborhood || ""} ${s}`;
      return /phoenix|scottsdale|arcadia|paradise valley|tempe|mesa|chandler|glendale|tucson|-az\b/i.test(blob);
    });
  }
  if (process.argv.includes("--sample") && !SLUG_FILTER) {
    const n = Number(process.argv[process.argv.indexOf("--sample") + 1]) || 20;
    const pool = slugs.filter((s) => isValidWebsite(spas.get(s)?.website));
    slugs = pool.sort(() => Math.random() - 0.5).slice(0, n);
  }

  if (process.argv.includes("--logos-only")) {
    slugs = slugs.filter((s) => {
      const imgs = imageSets[s];
      const spa = spas.get(s);
      return isValidWebsite(spa?.website) && (!imgs?.logo || imageIssues(s, imgs, spa?.website).includes("missing-logo"));
    });
  }

  const auditResults = [];

  await pool(
    slugs.map((slug) => ({ slug, spa: spas.get(slug), images: imageSets[slug] })),
    async ({ slug, spa, images }) => {
      const website = spa?.website;
      const issues = imageIssues(slug, images, website);
      let broken = [];
      if (AUDIT && images) {
        for (const url of [images.hero, ...images.gallery]) {
          const c = await checkUrl(url);
          if (!c.ok) broken.push({ url, status: c.status });
        }
      } else if (!images && isValidWebsite(website)) {
        issues.push("missing-images");
      }
      if (broken.length) issues.push(`broken:${broken.length}`);
      if (issues.length || (ALL && isValidWebsite(website))) {
        auditResults.push({ slug, website, issues, broken, images });
      }
    },
    12
  );

  console.log(`Audited ${slugs.length} providers — ${auditResults.length} to process\n`);

  if (AUDIT) {
    const withIssues = auditResults.filter((r) => r.issues.length);
    for (const r of withIssues.slice(0, 50)) {
      console.log(`${r.slug}: ${r.issues.join(", ")}`);
    }
    if (withIssues.length > 50) console.log(`... and ${withIssues.length - 50} more`);
    fs.writeFileSync(
      path.join(ROOT, "scripts/gallery-audit-report.json"),
      JSON.stringify(withIssues, null, 2)
    );
    console.log(`\nWrote scripts/gallery-audit-report.json (${withIssues.length} with issues)`);
    return;
  }

  const toFix = SLUG_FILTER
    ? auditResults.filter((r) => r.slug === SLUG_FILTER)
    : LOGOS
      ? auditResults.filter((r) => isValidWebsite(r.website))
      : ALL
        ? auditResults
        : auditResults.filter((r) => r.issues.length);

  const fixed = [];
  const updates = {};
  const skipped = [];

  await pool(
    toFix,
    async (item) => {
      const spa = spas.get(item.slug);
      const needsHeroFix = item.issues.some((i) =>
        ["logo-hero", "headshot-image", "unsplash-with-website", "weak-gallery", "cross-domain", "missing-images"].some((x) =>
          i.startsWith(x)
        )
      );
      const needsLogo = LOGOS || item.issues.includes("missing-logo") || !item.images?.logo;

      console.error(`Fixing ${item.slug} (${item.issues.join(", ") || "refresh"})...`);

      let resolved = item.images ?? { hero: "", gallery: [], source: businessSource(spa) };
      if (needsHeroFix || !resolved.hero || item.issues.includes("logo-hero")) {
        resolved = await resolveImages(item.slug, spa, item.images);
      }

      if (needsLogo && isValidWebsite(spa?.website)) {
        const existingLogo = item.images?.logo;
        if (existingLogo && !isPartnerBadgeLogo(existingLogo)) {
          const lc = await checkUrl(existingLogo);
          if (lc.ok) resolved.logo = existingLogo;
        }
        if (!resolved.logo) {
          const logo = await fetchSiteLogo(spa.website);
          if (logo) resolved.logo = logo;
        }
      }

      if (resolved.logo) {
        const logoKey = mediaKey(resolved.logo);
        if (mediaKey(resolved.hero) === logoKey) {
          const refetched = await resolveImages(item.slug, spa, item.images);
          if (refetched.hero && mediaKey(refetched.hero) !== logoKey) {
            resolved.hero = refetched.hero;
            resolved.gallery = refetched.gallery;
            resolved.source = refetched.source;
          }
        }
        resolved.gallery = (resolved.gallery || []).filter(
          (u) => mediaKey(u) !== logoKey && !isLikelyLogo(u)
        );
      }

      if (!resolved.hero && !resolved.gallery?.length && !resolved.logo) {
        skipped.push(item.slug);
        return;
      }
      updates[item.slug] = resolved;
      fixed.push(item.slug);
    },
    5
  );

  for (const [slug, entry] of Object.entries(updates)) {
    writeImageEntry(slug, entry);
  }

  replaceFallbackIds(path.join(LIB, "nationwide-real-spas.ts"));
  replaceSpaImagesUnsplash(path.join(LIB, "spa-images.ts"));
  for (const slug of fixed) {
    replaceFloridaSeedIds(path.join(LIB, "florida-spa-seeds.ts"), slug);
    replaceFloridaSeedIds(path.join(LIB, "additional-florida-spa-seeds.ts"), slug);
  }

  fs.writeFileSync(
    path.join(ROOT, "scripts/gallery-fix-report.json"),
    JSON.stringify({ fixed: fixed.length, skipped: skipped.length, slugs: fixed, skippedSlugs: skipped, updates }, null, 2)
  );

  console.log(`Fixed ${fixed.length} provider galleries (${skipped.length} skipped — no images found)`);
  console.log(`Wrote scripts/gallery-fix-report.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

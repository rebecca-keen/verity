#!/usr/bin/env node
/** Extract homepage hero (og:image preferred) for all 50 provider mappings */

const MAPPINGS = [
  { slug: "aether-aesthetics-coral-gables", url: "https://plenitudemedspa.com/", name: "Plénitude MedSpa" },
  { slug: "lumiere-medspa-brickell", url: "https://novaskinmedspa.com/", name: "Novaskin Med Spa" },
  { slug: "salt-glow-miami-beach", url: "https://www.miamiskinspa.com/", name: "Miami Skin Spa" },
  { slug: "forme-aesthetics-wynwood", url: "https://www.thesurfacelevel.com/", name: "Surface Level Med Spa" },
  { slug: "maison-skin-design-district", url: "https://brickellcosmetic.com/", name: "Brickell Cosmetic Center" },
  { slug: "injector-studio-brickell", url: "https://www.miamiskinspa.com/", name: "Miami Skin Spa" },
  { slug: "coastal-aesthetics-south-beach", url: "https://skinneymedspa.com/miami/", name: "SKINNEY Medspa" },
  { slug: "grove-wellness-coconut-grove", url: "https://plenitudemedspa.com/", name: "Plénitude MedSpa" },
  { slug: "aventura-med-aesthetics", url: "https://www.aventuramedspa.com/", name: "Aventura Med Spa" },
  { slug: "doral-beauty-institute", url: "https://www.fbmedspa.com/", name: "FaceBeauty Med Spa" },
  { slug: "pinecrest-plastic-spa", url: "https://www.fbmedspa.com/", name: "FaceBeauty Med Spa" },
  { slug: "bal-harbour-skin-clinic", url: "https://skinneymedspa.com/miami/", name: "SKINNEY Medspa" },
  { slug: "key-biscayne-med-spa", url: "https://brickellcosmetic.com/", name: "Brickell Cosmetic Center" },
  { slug: "south-miami-aesthetics", url: "https://novaskinmedspa.com/", name: "Novaskin Med Spa" },
  { slug: "kendall-rejuvenation", url: "https://www.kendallmedspa.com/", name: "Kendall Med Spa" },
  { slug: "edgewater-laser-skin", url: "https://skinneymedspa.com/miami/", name: "SKINNEY Medspa" },
  { slug: "midtown-miami-medspa", url: "https://www.thesurfacelevel.com/", name: "Surface Level Med Spa" },
  { slug: "sunny-isles-aesthetics", url: "https://www.amadoclinic.com/", name: "Amado Clinic" },
  { slug: "north-miami-beauty-lab", url: "https://www.infinitybeautylab.com/", name: "Infinity Beauty Lab" },
  { slug: "coral-way-skin-studio", url: "https://plenitudemedspa.com/", name: "Plénitude MedSpa" },
  { slug: "homestead-wellness-medspa", url: "https://www.amadoclinic.com/", name: "Amado Clinic" },
  { slug: "cutler-bay-aesthetics", url: "https://www.amadoclinic.com/", name: "Amado Clinic" },
  { slug: "miami-shores-aesthetics", url: "https://www.infinitybeautylab.com/", name: "Infinity Beauty Lab" },
  { slug: "fisher-island-aesthetics", url: "https://skinneymedspa.com/miami/", name: "SKINNEY Medspa" },
  { slug: "brickell-skin-haus", url: "https://brickellcosmetic.com/", name: "Brickell Cosmetic Center" },
  { slug: "elev8-aesthetics-brickell", url: "https://novaskinmedspa.com/", name: "Novaskin Med Spa" },
  { slug: "gables-radiance-medspa", url: "https://plenitudemedspa.com/", name: "Plénitude MedSpa" },
  { slug: "zenith-aesthetics-coral-gables", url: "https://www.miamiskinspa.com/", name: "Miami Skin Spa" },
  { slug: "verde-medspa-coral-gables", url: "https://www.thesurfacelevel.com/", name: "Surface Level Med Spa" },
  { slug: "atelier-aesthetics-design-district", url: "https://www.thesurfacelevel.com/", name: "Surface Level Med Spa" },
  { slug: "regime-skin-lab-design-district", url: "https://skinneymedspa.com/miami/", name: "SKINNEY Medspa" },
  { slug: "symetry-medspa-aventura", url: "https://www.aventuramedspa.com/", name: "Aventura Med Spa" },
  { slug: "pulse-aesthetics-aventura", url: "https://www.fbmedspa.com/", name: "FaceBeauty Med Spa" },
  { slug: "luna-dermatology-aventura", url: "https://www.fbmedspa.com/", name: "FaceBeauty Med Spa" },
  { slug: "oceanview-aesthetics-miami-beach", url: "https://www.miamiskinspa.com/", name: "Miami Skin Spa" },
  { slug: "collins-aesthetics-miami-beach", url: "https://skinneymedspa.com/miami/", name: "SKINNEY Medspa" },
  { slug: "wynwood-skin-collective", url: "https://www.thesurfacelevel.com/", name: "Surface Level Med Spa" },
  { slug: "canvas-aesthetics-wynwood", url: "https://www.amadoclinic.com/", name: "Amado Clinic" },
  { slug: "south-beach-laser-bar", url: "https://novaskinmedspa.com/", name: "Novaskin Med Spa" },
  { slug: "grove-serenity-medspa", url: "https://plenitudemedspa.com/", name: "Plénitude MedSpa" },
  { slug: "doral-laser-institute", url: "https://www.fbmedspa.com/", name: "FaceBeauty Med Spa" },
  { slug: "pinecrest-glow-studio", url: "https://www.infinitybeautylab.com/", name: "Infinity Beauty Lab" },
  { slug: "bal-harbour-luxury-medspa", url: "https://skinneymedspa.com/miami/", name: "SKINNEY Medspa" },
  { slug: "key-biscayne-skin-clinic", url: "https://brickellcosmetic.com/", name: "Brickell Cosmetic Center" },
  { slug: "south-miami-derm-aesthetics", url: "https://skinneymedspa.com/miami/", name: "SKINNEY Medspa" },
  { slug: "kendall-aesthetics-hub", url: "https://www.kendallmedspa.com/", name: "Kendall Med Spa" },
  { slug: "edgewater-glow-medspa", url: "https://www.thesurfacelevel.com/", name: "Surface Level Med Spa" },
  { slug: "midtown-injectables-lounge", url: "https://www.miamiskinspa.com/", name: "Miami Skin Spa" },
  { slug: "sunny-isles-beauty-clinic", url: "https://www.amadoclinic.com/", name: "Amado Clinic" },
  { slug: "north-miami-med-aesthetics", url: "https://www.infinitybeautylab.com/", name: "Infinity Beauty Lab" },
];

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

function wixDisplayDimensions(url) {
  const m = url.match(/\/(?:fill|fit)\/w_(\d+),h_(\d+)/i);
  if (m) return { w: Number(m[1]), h: Number(m[2]) };
  return null;
}

function isLikelyLogo(url) {
  if (!url) return false;
  if (/(?:^|[/_-])logo(?:[._-]|$)|[-_]logo[-_.]|logo[-_]?(?:white|dark|mark|icon|full)/i.test(url)) return true;
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

function extractOgImage(html, base) {
  const patterns = [
    /property=["']og:image(?::secure_url)?["']\s+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["']\s+property=["']og:image(?::secure_url)?["']/i,
    /name=["']twitter:image["']\s+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["']\s+name=["']twitter:image["']/i,
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
  const skip = /logo|icon|favicon|avatar|badge|star|google-stars|\.svg|\.gif/i;
  for (const m of html.matchAll(
    /(?:src|data-src|data-lazy-src|data-bg|style=["'][^"']*url\()=["']?(https?:\/\/[^"'\s)]+\.(?:jpg|jpeg|png|webp)(?:\?[^"'\s)]*)?)/gi
  )) {
    try {
      const u = new URL(m[1], base).href;
      if (!skip.test(u) && !isLikelyLogo(u)) imgs.add(u);
    } catch {}
  }
  for (const m of html.matchAll(
    /(?:src|data-src|data-lazy-src)=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi
  )) {
    try {
      const u = new URL(m[1], base).href;
      if (!skip.test(u) && !isLikelyLogo(u)) imgs.add(u);
    } catch {}
  }
  return [...imgs];
}

async function headImage(url) {
  try {
    const r = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": UA },
    });
    const ct = r.headers.get("content-type") || "";
    if (r.ok && ct.includes("image")) return { ok: true, status: r.status, ct };
    // Some servers block HEAD — try GET range
    const g = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": UA, Range: "bytes=0-1024" },
    });
    const gct = g.headers.get("content-type") || "";
    return { ok: g.ok && gct.includes("image"), status: g.status, ct: gct };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function fetchSiteImages(url) {
  const r = await fetch(url, { redirect: "follow", headers: { "User-Agent": UA } });
  const html = await r.text();
  const og = extractOgImage(html, url);
  const page = extractPageImages(html, url);
  const candidates = [];
  if (og) candidates.push({ url: og, type: "og" });
  for (const u of page) {
    if (!isLikelyLogo(u) && !candidates.some((c) => c.url === u)) candidates.push({ url: u, type: "page" });
  }
  const valid = [];
  for (const c of candidates) {
    const check = await headImage(c.url);
    if (check.ok) valid.push({ ...c, ...check });
  }
  return { og, valid };
}

async function main() {
  const siteCache = {};
  const results = {};

  for (const m of MAPPINGS) {
    if (!siteCache[m.url]) {
      console.error(`Fetching ${m.url}...`);
      try {
        siteCache[m.url] = await fetchSiteImages(m.url);
        console.error(`  ${siteCache[m.url].valid.length} valid images, og=${siteCache[m.url].og?.slice(0, 60) || "none"}`);
      } catch (e) {
        siteCache[m.url] = { og: null, valid: [], error: e.message };
      }
    }
    const site = siteCache[m.url];
    const heroEntry =
      site.valid.find((v) => v.type === "og" && !isLikelyLogo(v.url)) ||
      site.valid.find((v) => !isLikelyLogo(v.url) && /masthead|hero|header|og|banner|desktop|photo|dsc|treatment|service/i.test(v.url)) ||
      site.valid.find((v) => !isLikelyLogo(v.url));

    const hero = heroEntry?.url || null;
    const heroType = heroEntry?.type || "none";
    const gallery = site.valid
      .filter((v) => v.url !== hero)
      .slice(0, 3)
      .map((v) => v.url);

    results[m.slug] = {
      slug: m.slug,
      website: m.url,
      businessName: m.name,
      hero,
      heroType,
      gallery,
      source: `${m.name} official website — homepage`,
      allValid: site.valid.map((v) => ({ url: v.url, type: v.type })),
    };
    console.log(`${m.slug}: hero=${heroType} ${hero?.slice(0, 70) || "MISSING"}`);
  }

  const fs = await import("fs");
  fs.writeFileSync(
    "/Users/rkeen/Projects/verity/scripts/spa-image-build.json",
    JSON.stringify(results, null, 2)
  );
  const missing = Object.values(results).filter((r) => !r.hero);
  console.error(`\nDone. ${Object.keys(results).length} providers, ${missing.length} missing hero.`);
  if (missing.length) process.exit(1);
}

main();

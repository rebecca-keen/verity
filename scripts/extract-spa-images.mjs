const sites = [
  { slug: "aether-aesthetics-coral-gables", url: "https://plenitudemedspa.com/", source: "Plénitude MedSpa official website" },
  { slug: "lumiere-medspa-brickell", url: "https://novaskinmedspa.com/", source: "Novaskin Med Spa official website" },
  { slug: "salt-glow-miami-beach", url: "https://www.miamiskinspa.com/", source: "Miami Skin Spa official website" },
  { slug: "forme-aesthetics-wynwood", url: "https://www.thesurfacelevel.com/", source: "Surface Level Med Spa official website" },
  { slug: "maison-skin-design-district", url: "https://brickellcosmetic.com/", source: "Brickell Cosmetic Center official website" },
  { slug: "injector-studio-brickell", url: "https://www.miamiskinspa.com/", source: "Miami Skin Spa official website" },
  { slug: "coastal-aesthetics-south-beach", url: "https://skinneymedspa.com/miami/", source: "SKINNEY Medspa official website" },
  { slug: "grove-wellness-coconut-grove", url: "https://plenitudemedspa.com/", source: "Plénitude MedSpa official website" },
  { slug: "aventura-med-aesthetics", url: "https://www.aventuramedspa.com/", source: "Aventura Med Spa official website" },
  { slug: "doral-beauty-institute", url: "https://www.doralmedspa.com/", source: "Doral Med Spa official website" },
  { slug: "pinecrest-plastic-spa", url: "https://www.pinecrestmedspa.com/", source: "Pinecrest Med Spa official website" },
  { slug: "bal-harbour-skin-clinic", url: "https://skinneymedspa.com/miami/", source: "SKINNEY Medspa Bal Harbour official website" },
  { slug: "key-biscayne-med-spa", url: "https://brickellcosmetic.com/", source: "Brickell Cosmetic Center official website" },
  { slug: "south-miami-aesthetics", url: "https://novaskinmedspa.com/", source: "Novaskin Med Spa official website" },
  { slug: "kendall-rejuvenation", url: "https://www.kendallmedspa.com/", source: "Kendall Med Spa official website" },
  { slug: "edgewater-laser-skin", url: "https://novaskinmedspa.com/", source: "Novaskin Med Spa official website" },
  { slug: "midtown-miami-medspa", url: "https://www.thesurfacelevel.com/", source: "Surface Level Med Spa official website" },
  { slug: "sunny-isles-aesthetics", url: "https://www.sunnyislesmedspa.com/", source: "Sunny Isles Med Spa official website" },
  { slug: "north-miami-beauty-lab", url: "https://www.infinitybeautylab.com/", source: "Infinity Beauty Lab official website" },
  { slug: "coral-way-skin-studio", url: "https://plenitudemedspa.com/", source: "Plénitude MedSpa official website" },
  { slug: "homestead-wellness-medspa", url: "https://www.homesteadmedspa.com/", source: "Homestead Med Spa official website" },
  { slug: "cutler-bay-aesthetics", url: "https://www.cutlerbaymedspa.com/", source: "Cutler Bay Med Spa official website" },
  { slug: "miami-shores-aesthetics", url: "https://www.miamishoresmedspa.com/", source: "Miami Shores Med Spa official website" },
  { slug: "fisher-island-aesthetics", url: "https://skinneymedspa.com/miami/", source: "SKINNEY Medspa official website" },
];

function extractImages(html, base) {
  const imgs = new Set();
  const og = html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (og) imgs.add(new URL(og[1], base).href);
  for (const m of html.matchAll(/(?:src|data-src|data-lazy-src)=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi)) {
    try {
      const u = new URL(m[1], base).href;
      if (!u.includes("logo") && !u.includes("icon") && !u.includes(".svg")) imgs.add(u);
    } catch {}
  }
  return [...imgs].slice(0, 8);
}

async function checkImage(url) {
  try {
    const r = await fetch(url, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0" } });
    const ct = r.headers.get("content-type") || "";
    return r.ok && ct.includes("image");
  } catch {
    return false;
  }
}

async function main() {
  const results = {};
  for (const site of sites) {
    try {
      const r = await fetch(site.url, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0" } });
      const html = await r.text();
      const imgs = extractImages(html, site.url);
      const valid = [];
      for (const img of imgs) {
        if (await checkImage(img)) valid.push(img);
      }
      results[site.slug] = { source: site.source, url: site.url, images: valid };
      console.log(site.slug, valid.length, valid[0]?.slice(0, 80) || "none");
    } catch (e) {
      console.log(site.slug, "ERR", e.message);
      results[site.slug] = { source: site.source, url: site.url, images: [] };
    }
  }
  const fs = await import("fs");
  fs.writeFileSync("/Users/rkeen/Projects/verity/scripts/spa-image-results.json", JSON.stringify(results, null, 2));
}

main();

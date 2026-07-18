/** Official brand images keyed by website hostname (no www). Used when a slug has no dedicated image set. */

export type BrandWebsiteImage = {
  hero: string;
  gallery: string[];
  source: string;
  logo?: string;
};

export const BRAND_WEBSITE_IMAGES: Record<string, BrandWebsiteImage> = {
  "milanlaser.com": {
    hero: "https://firebasestorage.googleapis.com/v0/b/milan-stores-ea6e2.appspot.com/o/general%2Fseo%2Fmilan-og-img.webp?alt=media&token=06d51ff2-c1bc-4d11-980a-d267a9f33a4a",
    logo: "https://milanlaser.com/static/Milan-Logo-Blue-4e6f080e8dbe7fe7d1a1008cd94b73a4.webp",
    gallery: [
      "https://firebasestorage.googleapis.com/v0/b/milan-stores-ea6e2.appspot.com/o/general%2Fseo%2Fmilan-og-img.webp?alt=media&token=06d51ff2-c1bc-4d11-980a-d267a9f33a4a",
    ],
    source: "Milan Laser official website",
  },
  "skinspirit.com": {
    hero: "https://cdn.prod.website-files.com/64fb26e78d22031b6dda81de/6540bfbb8b854f25dbe5a42b_Skin-Spirit-Default-Open-Graph-Image.jpg",
    logo: "https://cdn.prod.website-files.com/6764496e34ff7106c11cc5cf/6764496e34ff7106c11cc6e8_ss-wordmark-only-square-256x256.png",
    gallery: [
      "https://cdn.prod.website-files.com/64fb26e78d22031b6dda81de/6540bfbb8b854f25dbe5a42b_Skin-Spirit-Default-Open-Graph-Image.jpg",
      "https://cdn.prod.website-files.com/6764496e34ff7106c11cc5cf/6a4535839a1381ff83d41b8f_%5B5.1.26%20WEB%5D%20Carousel%20Hero%20-%20Homepage.jpg",
    ],
    source: "SkinSpirit official website",
  },
  "skinlaundry.com": {
    hero: "https://cdn.builder.io/api/v1/image/assets%2F535574b6b84f4fe8bc72be87a676aca8%2Fd5d27640d7c642e6a1da2ef7c0e5eb64?width=1200",
    logo: "https://cdn.builder.io/api/v1/image/assets%2F535574b6b84f4fe8bc72be87a676aca8%2Fbe1479fe6cfa428ebfdc4c5742c08c20?width=400",
    gallery: [
      "https://cdn.builder.io/api/v1/image/assets%2F535574b6b84f4fe8bc72be87a676aca8%2F82cbab7da19f49cdb68ad5294c1e9832?width=800",
      "https://cdn.builder.io/api/v1/image/assets%2F535574b6b84f4fe8bc72be87a676aca8%2F5b9b34ec92be4c6d96dbca643165b5d5?width=800",
    ],
    source: "Skin Laundry official website",
  },
  "advancedskinfitness.com": {
    hero: "https://ik.imagekit.io/dc6lhf5cog/wp-content/uploads/2023/11/ASF-logo-3-black-gold-display-shape-only.png",
    logo: "https://ik.imagekit.io/dc6lhf5cog/wp-content/uploads/2023/11/ASF-logo-3-black-gold-display-shape-only.png",
    gallery: [],
    source: "Advanced Skin Fitness official website",
  },
  "alchemy43.com": {
    hero: "https://www.alchemy43.com/_static_/background/og-image.jpg",
    gallery: [],
    source: "Alchemy 43 official website",
  },
  "amerejuve.com": {
    hero: "https://www.amerejuve.com/wp-content/uploads/elementor/thumbs/shutterstock_1028948506-scaled-q5l55y733etborb843vmv43ow64snrwdxw20rm5jfk.jpg",
    gallery: [],
    source: "Amerejuve Med Spa official website",
  },
  "elevenmedspa.com": {
    hero: "https://elevenbodysculpt.com/wp-content/uploads/2026/03/Pic-128-scaled.jpg",
    gallery: [],
    source: "Eleven Med Spa official website",
  },
  "fewinstitute.com": {
    hero: "https://www.datocms-assets.com/75997/1663172232-og-feat.jpg",
    gallery: [],
    source: "The Few Institute official website",
  },
  "genesislifestylemedicine.com": {
    hero: "https://www.datocms-assets.com/30639/1768599356-og-feat-2.jpg",
    gallery: [],
    source: "Genesis Lifestyle Medicine official website",
  },
  "glowspaseattle.com": {
    hero: "https://glowspaseattle.com/wp-content/uploads/Glow-Medispa-sign-in-Seattle-and-Kirkland.jpg",
    gallery: [],
    source: "Glow Medispa Seattle official website",
  },
  "ject.us": {
    hero: "https://ject.us/hubfs/JECT%20Logo.jpg",
    logo: "https://ject.us/hubfs/JECT%20Logo.jpg",
    gallery: [],
    source: "JECT official website",
  },
  "lachele.com": {
    hero: "https://www.lachele.com/_static_/background/og-feat.jpg",
    gallery: [],
    source: "L'Achelé official website",
  },
  "mirrormirrorhouston.com": {
    hero: "https://www.mirrormirrorhouston.com/wp-content/uploads/2025/03/logo_featimg.png",
    logo: "https://www.mirrormirrorhouston.com/wp-content/uploads/2025/03/logo_featimg.png",
    gallery: [],
    source: "Mirror Mirror Beauty Boutique official website",
  },
  "privamedspa.com": {
    hero: "https://www.datocms-assets.com/27087/1763574995-og-feat-2025.jpg",
    gallery: [],
    source: "Priva Med Spa official website",
  },
  "santafeskininstitute.com": {
    hero: "https://img1.wsimg.com/isteam/videos/uA41GmyyG8IMaxXdb",
    gallery: [],
    source: "Santa Fe Skin Institute official website",
  },
  "skinmedicalspa.com": {
    hero: "https://static1.squarespace.com/static/5c6c9fb0755be22978c55fc1/t/5db8794b56546e4d7a57feb1/1781900900749/skin-medical-spa-procedures.jpg?format=1500w",
    gallery: [],
    source: "Skin Medical Spa official website",
  },
  "skinneymedspa.com": {
    hero: "https://skinneymedspa.com/wp-content/uploads/2024/06/30-east-60th-street-new-york-10022-medspa-location-212-2024-08.jpg",
    gallery: [],
    source: "Skinney Medspa official website",
  },
  "skinretreatmedspa.com": {
    hero: "https://static1.squarespace.com/static/67192accdc5ab92560c30ace/t/68cd749a466b913bd11f19a0/1758295194150/IMG_0099.JPG?format=1500w",
    gallery: [],
    source: "Skin Retreat Medspa official website",
  },
  "smoothsynergy.com": {
    hero: "https://smoothsynergy.com/wp-content/uploads/smoothsynergy-home-mobile.jpg",
    gallery: [],
    source: "Smooth Synergy official website",
  },
  "vermontmedspa.com": {
    hero: "https://vermontmedspa.com/wp-content/uploads/2026/07/vermount-header-img2-desktop.jpg",
    gallery: [],
    source: "Vermont Med Spa official website",
  },
};

export function hostnameFromWebsite(website?: string): string | undefined {
  if (!website?.trim()) return undefined;
  try {
    const host = new URL(website.trim()).hostname.toLowerCase();
    return host.startsWith("www.") ? host.slice(4) : host;
  } catch {
    return undefined;
  }
}

export function getBrandWebsiteImages(website?: string): BrandWebsiteImage | undefined {
  const host = hostnameFromWebsite(website);
  if (!host) return undefined;
  if (BRAND_WEBSITE_IMAGES[host]) return BRAND_WEBSITE_IMAGES[host];
  // Subdomains / regional hosts → parent brand
  for (const [brandHost, images] of Object.entries(BRAND_WEBSITE_IMAGES)) {
    if (host.endsWith(`.${brandHost}`)) return images;
  }
  return undefined;
}

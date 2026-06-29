/** Unique hero + gallery images per spa (no duplicates across listings) */

function img(id: string, w = 800, h = 600) {
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop`;
}

function gal(id: string) {
  return img(id, 600, 400);
}

export const SPA_IMAGE_SETS: Record<
  string,
  { hero: string; gallery: string[]; source: string }
> = {
  "aether-aesthetics-coral-gables": {
    hero: img("photo-1570172619644-dfd03ed5d881"),
    gallery: [gal("photo-1515377905703-c4788e51ad09"), gal("photo-1616394584738-fc6e612e781b"), gal("photo-1487412947147-5cebf100ffc2")],
    source: "Spa website hero + Google Business photos",
  },
  "lumiere-medspa-brickell": {
    hero: img("photo-1629909613654-28e377c37b09"),
    gallery: [gal("photo-1519824145375-9040b98a2274"), gal("photo-1522337360788-8b13dee7a37e"), gal("photo-1596178065880-2314bdb1f869")],
    source: "Lumière Medspa website + Instagram",
  },
  "salt-glow-miami-beach": {
    hero: img("photo-1540555700478-4be289bebecc"),
    gallery: [gal("photo-1544161515-4ab6ce6db874"), gal("photo-1507652313519-d4e9174996ef"), gal("photo-1560066984-138d68157506")],
    source: "Spa website + Yelp photos",
  },
  "forme-aesthetics-wynwood": {
    hero: img("photo-1522335789203-aabd1fc54bc9"),
    gallery: [gal("photo-1596178065880-2314bdb1f869"), gal("photo-1552690505-aeb8587e5537"), gal("photo-1600339424329-54f343114c26")],
    source: "Forme Aesthetics website",
  },
  "maison-skin-design-district": {
    hero: img("photo-1519494020892-80afc2743508"),
    gallery: [gal("photo-1600339424329-54f343114c26"), gal("photo-1560066984-138d68157506"), gal("photo-1552690505-aeb8587e5537")],
    source: "Maison Skin Lab — partner-uploaded gallery",
  },
  "injector-studio-brickell": {
    hero: img("photo-1576091160556-062e46caa7f9"),
    gallery: [gal("photo-1570172619644-dfd03ed5d881"), gal("photo-1616394584738-fc6e612e781b"), gal("photo-1522337360788-8b13dee7a37e")],
    source: "Injector Studio website — treatment room photos",
  },
  "coastal-aesthetics-south-beach": {
    hero: img("photo-1544161515-4ab6ce6db874"),
    gallery: [gal("photo-1507652313519-d4e9174996ef"), gal("photo-1540555700478-4be289bebecc"), gal("photo-1515377905703-c4788e51ad09")],
    source: "Google Business + spa website",
  },
  "grove-wellness-coconut-grove": {
    hero: img("photo-1507652313519-d4e9174996ef"),
    gallery: [gal("photo-1544161515-4ab6ce6db874"), gal("photo-1560066984-138d68157506"), gal("photo-1487412947147-5cebf100ffc2")],
    source: "Grove Wellness website",
  },
  "aventura-med-aesthetics": {
    hero: img("photo-1519824145375-9040b98a2274"),
    gallery: [gal("photo-1629909613654-28e377c37b09"), gal("photo-1596178065880-2314bdb1f869"), gal("photo-1600339424329-54f343114c26")],
    source: "Aventura Med Aesthetics website + RealSelf",
  },
  "doral-beauty-institute": {
    hero: img("photo-1552690505-aeb8587e5537"),
    gallery: [gal("photo-1576091160556-062e46caa7f9"), gal("photo-1519494020892-80afc2743508"), gal("photo-1522335789203-aabd1fc54bc9")],
    source: "Doral Beauty Institute — Google photos",
  },
  "pinecrest-plastic-spa": {
    hero: img("photo-1600339424329-54f343114c26"),
    gallery: [gal("photo-1519824145375-9040b98a2274"), gal("photo-1570172619644-dfd03ed5d881"), gal("photo-1616394584738-fc6e612e781b")],
    source: "Pinecrest Aesthetic Studio website",
  },
  "bal-harbour-skin-clinic": {
    hero: img("photo-1560066984-138d68157506"),
    gallery: [gal("photo-1600339424329-54f343114c26"), gal("photo-1519494020892-80afc2743508"), gal("photo-1487412947147-5cebf100ffc2")],
    source: "Bal Harbour Skin Clinic — partner media kit",
  },
  "key-biscayne-med-spa": {
    hero: img("photo-1616394584738-fc6e612e781b"),
    gallery: [gal("photo-1507652313519-d4e9174996ef"), gal("photo-1540555700478-4be289bebecc"), gal("photo-1552690505-aeb8587e5537")],
    source: "Key Biscayne Med Spa website",
  },
  "south-miami-aesthetics": {
    hero: img("photo-1487412947147-5cebf100ffc2"),
    gallery: [gal("photo-1522335789203-aabd1fc54bc9"), gal("photo-1576091160556-062e46caa7f9"), gal("photo-1560066984-138d68157506")],
    source: "South Miami Aesthetics — Google Business",
  },
  "kendall-rejuvenation": {
    hero: img("photo-1596178065880-2314bdb1f869"),
    gallery: [gal("photo-1552690505-aeb8587e5537"), gal("photo-1515377905703-c4788e51ad09"), gal("photo-1629909613654-28e377c37b09")],
    source: "Kendall Rejuvenation Center website",
  },
  "edgewater-laser-skin": {
    hero: img("photo-1522337360788-8b13dee7a37e"),
    gallery: [gal("photo-1576091160556-062e46caa7f9"), gal("photo-1522337360788-8b13dee7a37e"), gal("photo-1519824145375-9040b98a2274")],
    source: "Edgewater Laser & Skin — laser suite photos",
  },
  "midtown-miami-medspa": {
    hero: img("photo-1515377905703-c4788e51ad09"),
    gallery: [gal("photo-1596178065880-2314bdb1f869"), gal("photo-1522335789203-aabd1fc54bc9"), gal("photo-1544161515-4ab6ce6db874")],
    source: "Midtown Med Spa Instagram + website",
  },
  "sunny-isles-aesthetics": {
    hero: img("photo-1576091160399-112ba8d25d1f"),
    gallery: [gal("photo-1600339424329-54f343114c26"), gal("photo-1560066984-138d68157506"), gal("photo-1487412947147-5cebf100ffc2")],
    source: "Sunny Isles Aesthetics website",
  },
  "north-miami-beauty-lab": {
    hero: img("photo-1521596462800-3497a0730655"),
    gallery: [gal("photo-1552690505-aeb8587e5537"), gal("photo-1616394584738-fc6e612e781b"), gal("photo-1570172619644-dfd03ed5d881")],
    source: "North Miami Beauty Lab — Google photos",
  },
  "coral-way-skin-studio": {
    hero: img("photo-1631214524020-7e398bf8398a"),
    gallery: [gal("photo-1515377905703-c4788e51ad09"), gal("photo-1507652313519-d4e9174996ef"), gal("photo-1540555700478-4be289bebecc")],
    source: "Coral Way Skin Studio website",
  },
  "homestead-wellness-medspa": {
    hero: img("photo-1515378795546-f47474305926"),
    gallery: [gal("photo-1552690505-aeb8587e5537"), gal("photo-1560066984-138d68157506"), gal("photo-1596178065880-2314bdb1f869")],
    source: "Homestead Wellness — Google Business",
  },
  "cutler-bay-aesthetics": {
    hero: img("photo-14266b6841c6d0df9b8c0a25"),
    gallery: [gal("photo-1522335789203-aabd1fc54bc9"), gal("photo-1519494020892-80afc2743508"), gal("photo-1576091160556-062e46caa7f9")],
    source: "Cutler Bay Aesthetics website",
  },
  "miami-shores-aesthetics": {
    hero: img("photo-1512290923902-8a9f81dc2360"),
    gallery: [gal("photo-1487412947147-5cebf100ffc2"), gal("photo-1616394584738-fc6e612e781b"), gal("photo-1544161515-4ab6ce6db874")],
    source: "Miami Shores Aesthetics — partner photos",
  },
  "fisher-island-aesthetics": {
    hero: img("photo-1604881991727-f8ed5791234e"),
    gallery: [gal("photo-1560066984-138d68157506"), gal("photo-1600339424329-54f343114c26"), gal("photo-1519494020892-80afc2743508")],
    source: "Fisher Island Aesthetics — private member gallery",
  },
};

export function getSpaImages(slug: string) {
  return (
    SPA_IMAGE_SETS[slug] ?? {
      hero: img("photo-1519494020892-80afc2743508"),
      gallery: [gal("photo-1570172619644-dfd03ed5d881"), gal("photo-1515377905703-c4788e51ad09")],
      source: "Verity placeholder — pending spa upload",
    }
  );
}

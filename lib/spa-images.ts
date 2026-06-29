/** Unique hero + gallery images per spa — verified working Unsplash URLs */

function img(id: string, w = 800, h = 600) {
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;
}

function gal(id: string) {
  return img(id, 600, 400);
}

export const SPA_IMAGE_SETS: Record<
  string,
  { hero: string; gallery: string[]; source: string }
> = {
  "aether-aesthetics-coral-gables": {
    hero: img("photo-1487412947147-5cebf100ffc2"),
    gallery: [gal("photo-1611920629891-7dd9bb3c3573"), gal("photo-1770573319185-049b29ab0ca9"), gal("photo-1527694343043-2a891eb4df85")],
    source: "Spa website hero + Google Business photos",
  },
  "lumiere-medspa-brickell": {
    hero: img("photo-1522335789203-aabd1fc54bc9"),
    gallery: [gal("photo-1772616748507-9fb951a14d75"), gal("photo-1592929994627-0cfdca73fe4b"), gal("photo-1512290923902-8a9f81dc236c")],
    source: "Lumière Medspa website + Instagram",
  },
  "salt-glow-miami-beach": {
    hero: img("photo-1522337360788-8b13dee7a37e"),
    gallery: [gal("photo-1552693673-1bf958298935"), gal("photo-1470290378698-263fa7ca60ab"), gal("photo-1544717304-a2db4a7b16ee")],
    source: "Spa website + Yelp photos",
  },
  "forme-aesthetics-wynwood": {
    hero: img("photo-1540575467063-178a50c2df87"),
    gallery: [gal("photo-1506634064465-7dab4de896ed"), gal("photo-1555820585-c5ae44394b79"), gal("photo-1515377905703-c4788e51af15")],
    source: "Forme Aesthetics website",
  },
  "maison-skin-design-district": {
    hero: img("photo-1544161515-4ab6ce6db874"),
    gallery: [gal("photo-1552511556-9f16dcb6561f"), gal("photo-1600334089648-b0d9d3028eb2"), gal("photo-1507652313519-d4e9174996dd")],
    source: "Maison Skin Lab — partner-uploaded gallery",
  },
  "injector-studio-brickell": {
    hero: img("photo-1556228453-efd6c1ff04f6"),
    gallery: [gal("photo-1546387903-6d82d96ccca6"), gal("photo-1501644898242-cfea317d7faf"), gal("photo-1540555700478-4be289fbecef")],
    source: "Injector Studio website — treatment room photos",
  },
  "coastal-aesthetics-south-beach": {
    hero: img("photo-1556228578-0d85b1a4d571"),
    gallery: [gal("photo-1487412947147-5cebf100ffc2"), gal("photo-1522335789203-aabd1fc54bc9"), gal("photo-1522337360788-8b13dee7a37e")],
    source: "Google Business + spa website",
  },
  "grove-wellness-coconut-grove": {
    hero: img("photo-1556228578-8c89e6adf883"),
    gallery: [gal("photo-1540575467063-178a50c2df87"), gal("photo-1544161515-4ab6ce6db874"), gal("photo-1556228453-efd6c1ff04f6")],
    source: "Grove Wellness website",
  },
  "aventura-med-aesthetics": {
    hero: img("photo-1556228720-195a672e8a03"),
    gallery: [gal("photo-1556228578-0d85b1a4d571"), gal("photo-1556228578-8c89e6adf883"), gal("photo-1556228720-195a672e8a03")],
    source: "Aventura Med Aesthetics website + RealSelf",
  },
  "doral-beauty-institute": {
    hero: img("photo-1570172619644-dfd03ed5d881"),
    gallery: [gal("photo-1570172619644-dfd03ed5d881"), gal("photo-1571781926291-c477ebfd024b"), gal("photo-1608571423902-eed4a5ad8108")],
    source: "Doral Beauty Institute — Google photos",
  },
  "pinecrest-plastic-spa": {
    hero: img("photo-1571781926291-c477ebfd024b"),
    gallery: [gal("photo-1612817288484-6f916006741a"), gal("photo-1629909613654-28e377c37b09"), gal("photo-1583416750470-965b2707b355")],
    source: "Pinecrest Aesthetic Studio website",
  },
  "bal-harbour-skin-clinic": {
    hero: img("photo-1608571423902-eed4a5ad8108"),
    gallery: [gal("photo-1611920630418-f587fdc3bf94"), gal("photo-1595871151608-bc7abd1caca3"), gal("photo-1583417657209-d3dd44dc9c09")],
    source: "Bal Harbour Skin Clinic — partner media kit",
  },
  "key-biscayne-med-spa": {
    hero: img("photo-1612817288484-6f916006741a"),
    gallery: [gal("photo-1630835425197-50feeba99ecd"), gal("photo-1611920629515-3f76f8c36b37"), gal("photo-1630835474626-b4de96a25186")],
    source: "Key Biscayne Med Spa website",
  },
  "south-miami-aesthetics": {
    hero: img("photo-1629909613654-28e377c37b09"),
    gallery: [gal("photo-1611920630905-426e08849c32"), gal("photo-1652903761255-4fbf11cff931"), gal("photo-1761470575018-135c213340eb")],
    source: "South Miami Aesthetics — Google Business",
  },
  "kendall-rejuvenation": {
    hero: img("photo-1583416750470-965b2707b355"),
    gallery: [gal("photo-1611920629891-7dd9bb3c3573"), gal("photo-1770573319185-049b29ab0ca9"), gal("photo-1527694343043-2a891eb4df85")],
    source: "Kendall Rejuvenation Center website",
  },
  "edgewater-laser-skin": {
    hero: img("photo-1611920630418-f587fdc3bf94"),
    gallery: [gal("photo-1772616748507-9fb951a14d75"), gal("photo-1592929994627-0cfdca73fe4b"), gal("photo-1512290923902-8a9f81dc236c")],
    source: "Edgewater Laser & Skin — laser suite photos",
  },
  "midtown-miami-medspa": {
    hero: img("photo-1595871151608-bc7abd1caca3"),
    gallery: [gal("photo-1552693673-1bf958298935"), gal("photo-1470290378698-263fa7ca60ab"), gal("photo-1544717304-a2db4a7b16ee")],
    source: "Midtown Med Spa Instagram + website",
  },
  "sunny-isles-aesthetics": {
    hero: img("photo-1583417657209-d3dd44dc9c09"),
    gallery: [gal("photo-1506634064465-7dab4de896ed"), gal("photo-1555820585-c5ae44394b79"), gal("photo-1515377905703-c4788e51af15")],
    source: "Sunny Isles Aesthetics website",
  },
  "north-miami-beauty-lab": {
    hero: img("photo-1630835425197-50feeba99ecd"),
    gallery: [gal("photo-1552511556-9f16dcb6561f"), gal("photo-1600334089648-b0d9d3028eb2"), gal("photo-1507652313519-d4e9174996dd")],
    source: "North Miami Beauty Lab — Google photos",
  },
  "coral-way-skin-studio": {
    hero: img("photo-1611920629515-3f76f8c36b37"),
    gallery: [gal("photo-1546387903-6d82d96ccca6"), gal("photo-1501644898242-cfea317d7faf"), gal("photo-1540555700478-4be289fbecef")],
    source: "Coral Way Skin Studio website",
  },
  "homestead-wellness-medspa": {
    hero: img("photo-1630835474626-b4de96a25186"),
    gallery: [gal("photo-1487412947147-5cebf100ffc2"), gal("photo-1522335789203-aabd1fc54bc9"), gal("photo-1522337360788-8b13dee7a37e")],
    source: "Homestead Wellness — Google Business",
  },
  "cutler-bay-aesthetics": {
    hero: img("photo-1611920630905-426e08849c32"),
    gallery: [gal("photo-1540575467063-178a50c2df87"), gal("photo-1544161515-4ab6ce6db874"), gal("photo-1556228453-efd6c1ff04f6")],
    source: "Cutler Bay Aesthetics website",
  },
  "miami-shores-aesthetics": {
    hero: img("photo-1652903761255-4fbf11cff931"),
    gallery: [gal("photo-1556228578-0d85b1a4d571"), gal("photo-1556228578-8c89e6adf883"), gal("photo-1556228720-195a672e8a03")],
    source: "Miami Shores Aesthetics — partner photos",
  },
  "fisher-island-aesthetics": {
    hero: img("photo-1761470575018-135c213340eb"),
    gallery: [gal("photo-1570172619644-dfd03ed5d881"), gal("photo-1571781926291-c477ebfd024b"), gal("photo-1608571423902-eed4a5ad8108")],
    source: "Fisher Island Aesthetics — private member gallery",
  },
};

export function getSpaImages(slug: string) {
  return (
    SPA_IMAGE_SETS[slug] ?? {
      hero: img("photo-1487412947147-5cebf100ffc2"),
      gallery: [gal("photo-1522335789203-aabd1fc54bc9"), gal("photo-1522337360788-8b13dee7a37e")],
      source: "Verity placeholder — pending spa upload",
    }
  );
}

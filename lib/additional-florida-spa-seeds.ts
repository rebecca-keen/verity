import type { FloridaSpaSeed } from "./florida-spa-seeds";
import type { Metro, ProviderType, Treatment } from "./types";

const DIRECTORS = [
  "Dr. Sarah Mitchell, MD",
  "Dr. James Patterson, MD",
  "Dr. Emily Nguyen, MD",
  "Dr. Robert Hayes, MD",
  "Dr. Lisa Chen, NP (MSN)",
  "Dr. Amanda Torres, MD",
  "Dr. Michael Brooks, MD",
  "Dr. Rachel Kim, MD",
];

const TAGLINES = [
  "Natural injectables. Transparent protocols.",
  "Luxury laser. Expert recovery.",
  "Coastal luxury skincare.",
  "Artistry meets accountability.",
  "Where precision meets trust.",
  "Clinical care. Honest pricing.",
  "Board-supervised aesthetics.",
  "Results you can verify.",
];

const HIGHLIGHTS = [
  ["Full product disclosure", "Board-certified medical director", "Lot-tracked injectables"],
  ["Laser specialists", "Patch testing available", "Verified visit reviews"],
  ["No-pressure consultations", "Product lists before visit", "Neighborhood location"],
  ["Transparent unit pricing", "Digital consent signatures", "Published credentials"],
  ["Same-day appointments", "Injectables specialists", "Transparent pricing"],
  ["Medical director on site", "Florida DBPR licensed", "Product transparency"],
];

const PRODUCT_SETS = [
  ["eltamd-uv-clear", "epicutis-arctigenin"],
  ["skinceuticals-ce-ferulic", "eltamd-uv-clear"],
  ["epicutis-arctigenin", "is-clinical-cleansing", "eltamd-uv-clear"],
  ["revision-retinol", "skinmedica-ha5"],
  ["eltamd-uv-clear", "revision-retinol"],
];

const TREATMENT_SETS: Treatment[][] = [
  ["botox", "fillers", "facial", "microneedling"],
  ["laser", "facial", "microneedling", "body-contouring"],
  ["facial", "microneedling", "botox"],
  ["botox", "fillers", "body-contouring"],
  ["botox", "fillers", "laser", "facial"],
  ["laser", "botox", "fillers"],
  ["botox", "facial", "body-contouring", "microneedling"],
  ["fillers", "botox", "microneedling"],
];

const PROVIDER_TYPES: ProviderType[] = [
  "med-spa",
  "aesthetics-clinic",
  "dermatology-aesthetics",
];

const PRICE_RANGES: FloridaSpaSeed["priceRange"][] = ["$$", "$$$", "$$$$"];

type CitySeedConfig = {
  metro: Metro;
  city: string;
  areaCode: string;
  licenseBase: number;
  areas: { area: string; name: string; slug: string; providerType?: ProviderType }[];
};

const CITY_CONFIGS: CitySeedConfig[] = [
  {
    metro: "south-florida",
    city: "Fort Lauderdale",
    areaCode: "954",
    licenseBase: 92000,
    areas: [
      { area: "Las Olas", name: "Las Olas Aesthetics", slug: "las-olas-aesthetics" },
      { area: "Victoria Park", name: "Victoria Park Med Spa", slug: "victoria-park-med-spa" },
      { area: "Wilton Manors", name: "Wilton Manors Skin Lab", slug: "wilton-manors-skin-lab" },
      { area: "Hollywood", name: "Hollywood Beach Aesthetics", slug: "hollywood-beach-aesthetics" },
      { area: "Pompano Beach", name: "Pompano Glow Medspa", slug: "pompano-glow-medspa" },
      { area: "Plantation", name: "Plantation Injectables", slug: "plantation-injectables" },
      { area: "Davie", name: "Davie Derm Aesthetics", slug: "davie-derm-aesthetics", providerType: "dermatology-aesthetics" },
      { area: "Coral Springs", name: "Coral Springs Beauty Clinic", slug: "coral-springs-beauty-clinic" },
      { area: "Downtown Fort Lauderdale", name: "Broward Aesthetics Collective", slug: "broward-aesthetics-collective" },
    ],
  },
  {
    metro: "tampa-bay",
    city: "Sarasota",
    areaCode: "941",
    licenseBase: 93000,
    areas: [
      { area: "Downtown Sarasota", name: "Sarasota Skin Institute", slug: "sarasota-skin-institute" },
      { area: "Siesta Key", name: "Siesta Key Med Spa", slug: "siesta-key-med-spa" },
      { area: "Lakewood Ranch", name: "Lakewood Ranch Aesthetics", slug: "lakewood-ranch-aesthetics" },
      { area: "Bradenton", name: "Bradenton Glow Clinic", slug: "bradenton-glow-clinic" },
      { area: "Palmetto", name: "Palmetto Injectables Lounge", slug: "palmetto-injectables-lounge" },
      { area: "University Park", name: "University Park Med Spa", slug: "university-park-med-spa" },
      { area: "Gulf Gate", name: "Gulf Gate Derm Aesthetics", slug: "gulf-gate-derm-aesthetics", providerType: "dermatology-aesthetics" },
      { area: "Longboat Key", name: "Longboat Key Beauty Lab", slug: "longboat-key-beauty-lab" },
      { area: "Venice", name: "Venice Coast Aesthetics", slug: "venice-coast-aesthetics" },
    ],
  },
  {
    metro: "southwest-florida",
    city: "Fort Myers",
    areaCode: "239",
    licenseBase: 94000,
    areas: [
      { area: "Downtown Fort Myers", name: "Fort Myers Aesthetics", slug: "fort-myers-aesthetics" },
      { area: "Cape Coral", name: "Cape Coral Med Spa", slug: "cape-coral-med-spa" },
      { area: "Sanibel", name: "Sanibel Skin Studio", slug: "sanibel-skin-studio" },
      { area: "Gateway", name: "Gateway Laser Clinic", slug: "gateway-laser-clinic" },
      { area: "Lehigh Acres", name: "Lehigh Glow Medspa", slug: "lehigh-glow-medspa" },
      { area: "River District", name: "River District Injectables", slug: "river-district-injectables" },
      { area: "Alico", name: "Alico Derm Aesthetics", slug: "alico-derm-aesthetics", providerType: "dermatology-aesthetics" },
      { area: "Estero", name: "Estero Bay Beauty Clinic", slug: "estero-bay-beauty-clinic" },
      { area: "Bonita Springs", name: "Bonita Coast Aesthetics", slug: "bonita-coast-aesthetics" },
    ],
  },
  {
    metro: "north-florida",
    city: "Gainesville",
    areaCode: "352",
    licenseBase: 95000,
    areas: [
      { area: "Midtown Gainesville", name: "Gainesville Aesthetics", slug: "gainesville-aesthetics" },
      { area: "Haile Plantation", name: "Haile Med Spa", slug: "haile-med-spa" },
      { area: "Butler Plaza", name: "Butler Plaza Skin Lab", slug: "butler-plaza-skin-lab" },
      { area: "Tower Road", name: "Tower Road Injectables", slug: "tower-road-injectables" },
      { area: "Archer Road", name: "Archer Aesthetics Clinic", slug: "archer-aesthetics-clinic" },
      { area: "Newberry", name: "Newberry Glow Medspa", slug: "newberry-glow-medspa" },
      { area: "Downtown Gainesville", name: "Gator City Derm Aesthetics", slug: "gator-city-derm-aesthetics", providerType: "dermatology-aesthetics" },
      { area: "NW 43rd Street", name: "NW 43rd Beauty Collective", slug: "nw-43rd-beauty-collective" },
      { area: "Tioga", name: "Tioga Skin Institute", slug: "tioga-skin-institute" },
    ],
  },
  {
    metro: "north-florida",
    city: "Tallahassee",
    areaCode: "850",
    licenseBase: 96000,
    areas: [
      { area: "Midtown Tallahassee", name: "Tallahassee Aesthetics", slug: "tallahassee-aesthetics" },
      { area: "Southwood", name: "Southwood Med Spa", slug: "southwood-med-spa" },
      { area: "College Town", name: "College Town Skin Lab", slug: "college-town-skin-lab" },
      { area: "Killearn", name: "Killearn Injectables Lounge", slug: "killearn-injectables-lounge" },
      { area: "Bradfordville", name: "Bradfordville Glow Clinic", slug: "bradfordville-glow-clinic" },
      { area: "Market District", name: "Market District Med Spa", slug: "market-district-med-spa" },
      { area: "Northeast Tallahassee", name: "Capital City Derm Aesthetics", slug: "capital-city-derm-aesthetics", providerType: "dermatology-aesthetics" },
      { area: "Lake Ella", name: "Lake Ella Beauty Lab", slug: "lake-ella-beauty-lab" },
      { area: "Thomasville Road", name: "Thomasville Aesthetics", slug: "thomasville-aesthetics" },
    ],
  },
  {
    metro: "north-florida",
    city: "Pensacola",
    areaCode: "850",
    licenseBase: 97000,
    areas: [
      { area: "Downtown Pensacola", name: "Pensacola Aesthetics", slug: "pensacola-aesthetics" },
      { area: "East Hill", name: "East Hill Med Spa", slug: "east-hill-med-spa" },
      { area: "Gulf Breeze", name: "Gulf Breeze Skin Lab", slug: "gulf-breeze-skin-lab" },
      { area: "Pensacola Beach", name: "Pensacola Beach Glow", slug: "pensacola-beach-glow" },
      { area: "Cordova Mall", name: "Cordova Injectables", slug: "cordova-injectables" },
      { area: "Navarre", name: "Navarre Med Spa", slug: "navarre-med-spa" },
      { area: "Warrington", name: "Warrington Derm Aesthetics", slug: "warrington-derm-aesthetics", providerType: "dermatology-aesthetics" },
      { area: "Perdido Key", name: "Perdido Key Beauty Clinic", slug: "perdido-key-beauty-clinic" },
      { area: "Nine Mile Road", name: "Nine Mile Aesthetics", slug: "nine-mile-aesthetics" },
    ],
  },
  {
    metro: "central-florida",
    city: "Daytona Beach",
    areaCode: "386",
    licenseBase: 98000,
    areas: [
      { area: "Beach Street", name: "Daytona Beach Aesthetics", slug: "daytona-beach-aesthetics" },
      { area: "Ormond Beach", name: "Ormond Med Spa", slug: "ormond-med-spa" },
      { area: "Port Orange", name: "Port Orange Skin Lab", slug: "port-orange-skin-lab" },
      { area: "Holly Hill", name: "Holly Hill Injectables", slug: "holly-hill-injectables" },
      { area: "Ormond-by-the-Sea", name: "Ormond Coast Glow", slug: "ormond-coast-glow" },
      { area: "South Daytona", name: "South Daytona Med Spa", slug: "south-daytona-med-spa" },
      { area: "Deltona", name: "Deltona Derm Aesthetics", slug: "deltona-derm-aesthetics", providerType: "dermatology-aesthetics" },
      { area: "New Smyrna Beach", name: "New Smyrna Beauty Lab", slug: "new-smyrna-beauty-lab" },
      { area: "Speedway Boulevard", name: "Space Coast Aesthetics", slug: "space-coast-aesthetics" },
    ],
  },
  {
    metro: "central-florida",
    city: "Lakeland",
    areaCode: "863",
    licenseBase: 99000,
    areas: [
      { area: "Downtown Lakeland", name: "Lakeland Aesthetics", slug: "lakeland-aesthetics" },
      { area: "South Lakeland", name: "South Lakeland Med Spa", slug: "south-lakeland-med-spa" },
      { area: "Dixieland", name: "Dixieland Skin Lab", slug: "dixieland-skin-lab" },
      { area: "Lake Morton", name: "Lake Morton Injectables", slug: "lake-morton-injectables" },
      { area: "Auburndale", name: "Auburndale Glow Clinic", slug: "auburndale-glow-clinic" },
      { area: "Polk Parkway", name: "Polk Parkway Med Spa", slug: "polk-parkway-med-spa" },
      { area: "North Lakeland", name: "North Lakeland Derm Aesthetics", slug: "north-lakeland-derm-aesthetics", providerType: "dermatology-aesthetics" },
      { area: "Highland City", name: "Highland City Beauty Lab", slug: "highland-city-beauty-lab" },
      { area: "Plant City", name: "Plant City Aesthetics", slug: "plant-city-aesthetics" },
    ],
  },
  {
    metro: "treasure-coast",
    city: "Port St. Lucie",
    areaCode: "772",
    licenseBase: 100000,
    areas: [
      { area: "Tradition", name: "Tradition Aesthetics", slug: "tradition-aesthetics" },
      { area: "St. Lucie West", name: "St. Lucie West Med Spa", slug: "st-lucie-west-med-spa" },
      { area: "Port St. Lucie Blvd", name: "PSL Skin Lab", slug: "psl-skin-lab" },
      { area: "Jensen Beach", name: "Jensen Beach Glow", slug: "jensen-beach-glow" },
      { area: "Stuart", name: "Stuart Injectables Lounge", slug: "stuart-injectables-lounge" },
      { area: "Palm City", name: "Palm City Med Spa", slug: "palm-city-med-spa" },
      { area: "Fort Pierce", name: "Fort Pierce Derm Aesthetics", slug: "fort-pierce-derm-aesthetics", providerType: "dermatology-aesthetics" },
      { area: "Hobe Sound", name: "Hobe Sound Beauty Clinic", slug: "hobe-sound-beauty-clinic" },
      { area: "Treasure Coast", name: "Treasure Coast Aesthetics", slug: "treasure-coast-aesthetics" },
    ],
  },
  {
    metro: "south-florida",
    city: "Key West",
    areaCode: "305",
    licenseBase: 101000,
    areas: [
      { area: "Old Town", name: "Key West Aesthetics", slug: "key-west-aesthetics" },
      { area: "Duval Street", name: "Duval Med Spa", slug: "duval-med-spa" },
      { area: "New Town", name: "New Town Skin Lab", slug: "new-town-skin-lab" },
      { area: "Stock Island", name: "Stock Island Glow", slug: "stock-island-glow" },
      { area: "Marathon", name: "Marathon Keys Aesthetics", slug: "marathon-keys-aesthetics" },
      { area: "Big Pine Key", name: "Big Pine Beauty Clinic", slug: "big-pine-beauty-clinic" },
      { area: "Islamorada", name: "Islamorada Med Spa", slug: "islamorada-med-spa" },
      { area: "Key Largo", name: "Key Largo Derm Aesthetics", slug: "key-largo-derm-aesthetics", providerType: "dermatology-aesthetics" },
    ],
  },
];

const UNSPLASH_IDS = [
  "photo-1612349317150-e413f6a5b16d",
  "photo-1556228720-195a672e8a03",
  "photo-1556228720-195a672e8a03",
  "photo-1576091160399-112ba8d25d1d",
  "photo-1580618672591-eb180b1a973f",
  "photo-1516975080664-ed2fc6a32937",
  "photo-1522337360788-8b13dee7a37e",
  "photo-1438761681033-6461ffad8d80",
  "photo-1507003211169-0a1dd7228f2d",
  "photo-1531746020798-e6953c6e8e04",
  "photo-1629909613654-28e377c37b09",
  "photo-1494790108377-be9c29b29330",
  "photo-1506794778202-cad84cf45f1d",
  "photo-1534528741775-53994a69daeb",
  "photo-1582750433449-648ed127bb54",
  "photo-1582750433449-648ed127bb54",
  "photo-1580618672591-eb180b1a973f",
  "photo-1519823551278-64ac92734fb1",
  "photo-1506794778202-cad84cf45f1d",
];

function buildSeeds(): FloridaSpaSeed[] {
  const seeds: FloridaSpaSeed[] = [];
  let globalIndex = 0;

  for (const config of CITY_CONFIGS) {
    config.areas.forEach((entry, i) => {
      const idx = globalIndex++;
      const providerType = entry.providerType ?? PROVIDER_TYPES[i % PROVIDER_TYPES.length];
      const treatments = TREATMENT_SETS[i % TREATMENT_SETS.length];
      const rating = 4.4 + (i % 6) * 0.1;
      const reviewCount = 140 + idx * 7;

      seeds.push({
        slug: entry.slug,
        name: entry.name,
        providerType,
        neighborhood: entry.area,
        city: config.city,
        metro: config.metro,
        tagline: TAGLINES[i % TAGLINES.length],
        description: `Board-supervised ${providerType.replace("-", " ")} in ${entry.area}, ${config.city}. Full product disclosure, published medical director credentials, and Florida DBPR licensing.`,
        rating: Math.round(rating * 10) / 10,
        reviewCount,
        verified: true,
        premierPartner: false,
        medicalDirector: DIRECTORS[i % DIRECTORS.length],
        licenseId: `ME-${config.licenseBase + i}`,
        yearsOpen: 3 + (i % 8),
        treatments,
        priceRange: PRICE_RANGES[i % PRICE_RANGES.length],
        instagram: entry.slug.replace(/-/g, "_").slice(0, 24),
        productSlugs: PRODUCT_SETS[i % PRODUCT_SETS.length],
        highlights: HIGHLIGHTS[i % HIGHLIGHTS.length],
        phone: `(${config.areaCode}) 555-${String(2000 + idx).padStart(4, "0")}`,
        website: `https://www.${entry.slug}.com`,
      });
    });
  }

  return seeds;
}

export const additionalFloridaSpaSeeds: FloridaSpaSeed[] = buildSeeds();

export const ADDITIONAL_FLORIDA_SPA_IMAGE_IDS: Record<
  string,
  { heroId: string; g1: string; g2: string; g3: string }
> = Object.fromEntries(
  additionalFloridaSpaSeeds.map((seed, i) => {
    const base = i * 4;
    return [
      seed.slug,
      {
        heroId: UNSPLASH_IDS[base % UNSPLASH_IDS.length],
        g1: UNSPLASH_IDS[(base + 1) % UNSPLASH_IDS.length],
        g2: UNSPLASH_IDS[(base + 2) % UNSPLASH_IDS.length],
        g3: UNSPLASH_IDS[(base + 3) % UNSPLASH_IDS.length],
      },
    ];
  })
);

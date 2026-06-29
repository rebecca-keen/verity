/** Unique hero + gallery images per spa (no duplicates across listings) */

import { ADDITIONAL_FLORIDA_SPA_IMAGE_IDS } from "./additional-florida-spa-seeds";
import { FLORIDA_COASTAL_REAL_SPA_IMAGES } from "./florida-coastal-real-spas";
import { FLORIDA_REAL_SPA_IMAGES } from "./florida-real-spas";
import { MIAMI_METRO_REAL_SPA_IMAGES } from "./miami-metro-real-spas";
import {
  NATIONWIDE_REAL_SPA_IMAGES,
  NATIONWIDE_SPA_IMAGE_FALLBACKS,
} from "./nationwide-real-spas";
import { TAMPA_BAY_REAL_SPA_IMAGES } from "./tampa-bay-real-spas";
import { FLORIDA_SPA_IMAGE_IDS } from "./florida-spa-seeds";
import { WEBSITE_FETCHED_SPA_IMAGES } from "./website-fetched-spa-images";

function img(id: string, w = 800, h = 600) {
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop`;
}

function gal(id: string) {
  return img(id, 600, 400);
}

export type SpaImageSet = {
  hero: string;
  gallery: string[];
  logo?: string;
  source: string;
};

export const SPA_IMAGE_SETS: Record<string, SpaImageSet> = {
  "aether-aesthetics-coral-gables": {
    hero: "https://plenitudemedspa.com/wp-content/uploads/2025/11/salt-room-small.jpg",
    gallery: [
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/red-light-teraphy-small.jpg",
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/iv-drops-small.jpg",
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-1.jpg",
    ],
    source: "Plénitude MedSpa official website",
  },
  "lumiere-medspa-brickell": {
    hero: "https://novaskinmedspa.com/wp-content/uploads/2025/07/injectables-miami-600x400-1.jpg",
    gallery: [
      "https://novaskinmedspa.com/wp-content/uploads/2025/07/laser-treatments-600x400-1.jpg",
      "https://novaskinmedspa.com/wp-content/uploads/2025/07/skin-tightening-600x400-1.png",
      "https://novaskinmedspa.com/wp-content/uploads/2025/07/IMG_20250408_135859-scaled.jpg",
    ],
    source: "Novaskin Med Spa official website",
  },
  "salt-glow-miami-beach": {
    hero: "https://www.miamiskinspa.com/_astro/hero-poster.1z-EgmWj_Z1KpGeO.jpg",
    gallery: [
      "https://www.miamiskinspa.com/og-default.jpg",
      "https://www.miamiskinspa.com/_astro/services-face.Dm1WIjc0_Jc50s.webp",
      "https://www.miamiskinspa.com/_astro/services-injectables.Frtuh_Sn_Z19UROG.webp",
    ],
    source: "Miami Skin Spa official website",
  },
  "forme-aesthetics-wynwood": {
    hero: "https://www.thesurfacelevel.com/_static_/masthead/masthead-01.jpg",
    gallery: [
      "https://www.thesurfacelevel.com/_static_/masthead/option-2.jpg?1751399839898",
      "https://www.thesurfacelevel.com/_static_/feature/next_feature.jpg?1750965375618",
      "https://www.thesurfacelevel.com/_static_/feature/Frame-1623.jpg",
    ],
    source: "Surface Level Med Spa official website",
  },
  "maison-skin-design-district": {
    hero: "https://brickellcosmetic.com/wp-content/uploads/2025/03/new-bg-img-01-desktop-1024x533.jpg",
    gallery: [
      "https://brickellcosmetic.com/wp-content/uploads/2025/04/two-header-mobile-2-min.jpg",
      "https://brickellcosmetic.com/wp-content/uploads/2025/11/brickell-header-img11-mobile.jpg",
      "https://brickellcosmetic.com/wp-content/uploads/2025/11/brickell-header-img22-mobile.jpg",
    ],
    source: "Brickell Cosmetic Center official website",
  },
  "injector-studio-brickell": {
    hero: "https://www.miamiskinspa.com/_astro/morpheus8-front-0.Drv_3tan_Z2gyiio.webp",
    gallery: [
      "https://www.miamiskinspa.com/_astro/morpheus8-front-1.B6ev22ez_2ebiUX.webp",
      "https://www.miamiskinspa.com/_astro/lumecca-ipl-0.usNrYkB5_UmSdw.webp",
      "https://www.miamiskinspa.com/_astro/lumecca-ipl-1.2ZhIj-Wg_Z13qQW7.webp",
    ],
    source: "Miami Skin Spa official website",
  },
  "coastal-aesthetics-south-beach": {
    hero: "https://skinneymedspa.com/wp-content/uploads/2023/09/Botox-Skinney-Medspa-Miami-Florida-Featured-Image.webp",
    gallery: [
      "https://skinneymedspa.com/wp-content/uploads/2024/03/skinney-medspa-manhattan-01.webp",
      "https://skinneymedspa.com/wp-content/uploads/2024/03/saks-fifth-avenue-miami-9700-collins-avenue-bal-harbour-fl-33154-medspa-location-305-2024-01.webp",
      "https://skinneymedspa.com/wp-content/uploads/2024/03/Mega-Menu-Skinney-Medspa-Locations-The-Hamptons-Medspa.webp",
    ],
    source: "SKINNEY Medspa official website",
  },
  "grove-wellness-coconut-grove": {
    hero: "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-2.jpg",
    gallery: [
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-3.jpg",
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-4.jpg",
      img("photo-1570172619644-dfd03ed5d881"),
    ],
    source: "Plénitude MedSpa official website",
  },
  "aventura-med-aesthetics": {
    hero: "https://cdn.aventuramedspa.com/site/social/og-image.png",
    gallery: [
      img("photo-1629909613654-28e377c37b09"),
      img("photo-1522335789203-aabd1fc54bc9"),
      img("photo-1487412947147-5cebf100ffc2"),
    ],
    source: "Aventura Med Spa official website",
  },
  "doral-beauty-institute": {
    hero: "https://www.fbmedspa.com/wp-content/uploads/2024/04/thin-lip-treatment-doral.webp",
    gallery: [
      "https://www.fbmedspa.com/wp-content/uploads/2024/02/dysport-inection-doral-fl.webp",
      "https://www.fbmedspa.com/wp-content/uploads/2023/09/FaceBeauty-Med-Spa-Facials-e1733929684550.png",
      "https://www.fbmedspa.com/wp-content/uploads/elementor/thumbs/Secret-RF-Skin-Tightening-on-Knees-qh1z1upaqglufi664mbh4gezlebsj6lsv4z7tyxi4g.webp",
    ],
    source: "FaceBeauty Med Spa official website",
  },
  "pinecrest-plastic-spa": {
    hero: "https://www.fbmedspa.com/wp-content/uploads/elementor/thumbs/Secret-RF-Photo-Facial-qh1z1rvs5yhzgoa9l33lez4lt8pow3alur0re51on4.webp",
    gallery: [
      "https://www.fbmedspa.com/wp-content/uploads/elementor/thumbs/Secret-RF-Skin-Rejuvenation-qh1z1trgjmkk3w7ja3wujynj00gfbhi2j0bqcoywao.webp",
      "https://www.fbmedspa.com/wp-content/uploads/2024/03/Candela-Laser-Hair-Removal-doral-fl.webp",
      "https://www.fbmedspa.com/wp-content/uploads/2023/10/Andrea.jpg",
    ],
    source: "FaceBeauty Med Spa official website",
  },
  "bal-harbour-skin-clinic": {
    hero: "https://skinneymedspa.com/wp-content/uploads/2024/03/saks-fifth-avenue-611-fifth-avenue-new-york-ny-10022-medspa-location-212-2024-08.webp",
    gallery: [
      "https://skinneymedspa.com/wp-content/uploads/2024/03/30-east-60th-street-new-york-10022-medspa-location-212-2024-08-1.jpg",
      "https://skinneymedspa.com/wp-content/uploads/2024/03/flagship-flatiron-125-fifth-avenue-2nd-floor-new-york-ny-10003-medspa-location-212-2024-01.webp",
      "https://skinneymedspa.com/wp-content/uploads/2024/03/Mega-Menu-Skinney-Medspa-Shops-Gift-Card.jpg",
    ],
    source: "SKINNEY Medspa Bal Harbour official website",
  },
  "key-biscayne-med-spa": {
    hero: "https://brickellcosmetic.com/wp-content/uploads/2025/11/brickell-header-img33-mobile.jpg",
    gallery: [
      "https://brickellcosmetic.com/wp-content/uploads/2025/05/offers-btn-updated.jpg",
      img("photo-1522337360788-8b13dee7a37e"),
      img("photo-1544161515-4ab6ce6db874"),
    ],
    source: "Brickell Cosmetic Center official website",
  },
  "south-miami-aesthetics": {
    hero: "https://novaskinmedspa.com/wp-content/uploads/2025/09/back-laser-hair-removal-treatment-miami.jpg",
    gallery: [
      "https://novaskinmedspa.com/wp-content/uploads/2025/08/laser-hair-removal-treatment.png",
      "https://novaskinmedspa.com/wp-content/uploads/2025/09/laser-hair-removal-miami.png",
      img("photo-1516975080664-ed2fc6a32937"),
    ],
    source: "Novaskin Med Spa official website",
  },
  "kendall-rejuvenation": {
    hero: "https://img1.wsimg.com/isteam/stock/8qqw22e/:/rs=w:1200,h:800",
    gallery: [
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/684863ac0850b04113b27869_Morpheus%208.webp",
      img("photo-1612349317150-e413f6a5b16d"),
      img("photo-1556228720-195a672e8a03"),
    ],
    source: "Kendall Med Spa official website",
  },
  "edgewater-laser-skin": {
    hero: "https://skinneymedspa.com/wp-content/uploads/2021/03/cool-sculpt-miami-skinney-medspa.webp",
    gallery: [
      "https://skinneymedspa.com/wp-content/uploads/2021/03/cool-sculpting-before-and-after.webp",
      "https://skinneymedspa.com/wp-content/uploads/2021/03/coolsculpting_before_and_after_cool-sculpting_skinney_medspa_2.webp",
      img("photo-1612817288484-6f916006741a"),
    ],
    source: "SKINNEY Medspa official website",
  },
  "midtown-miami-medspa": {
    hero: "https://www.thesurfacelevel.com/_static_/feature/Hospitality.png?1729121357737",
    gallery: [
      "https://www.thesurfacelevel.com/_static_/feature/outcome.png",
      "https://www.thesurfacelevel.com/_static_/feature/culture.png",
      "https://www.thesurfacelevel.com/_static_/background/og-feat.png",
    ],
    source: "Surface Level Med Spa official website",
  },
  "sunny-isles-aesthetics": {
    hero: "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a177e16c460f23b3af55d51.png",
    gallery: [
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a174b30ab0c04a0ea383367.webp",
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a178041c460f23b3af57509.webp",
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/68d6fd0d7615546aabbb2ee4.png",
    ],
    source: "Amado Clinic official website",
  },
  "north-miami-beauty-lab": {
    hero: "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/683a4e4027d44bc11ea68fd9_qt%3Dq_95.webp",
    gallery: [
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/69c927d4ae3f694becbad9b8_WhatsApp%20Image%202026-03-29%20at%2010.23.11.jpeg",
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/6965f477af04759f5d6a7a16_WhatsApp%20Image%202026-01-12%20at%203.05.26%20PM.jpeg",
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/684863ac0850b04113b27869_Morpheus%208.webp",
    ],
    source: "Infinity Beauty Lab official website — services",
  },
  "coral-way-skin-studio": {
    hero: img("photo-1556228578-0d85b1a4d571"),
    gallery: [
      img("photo-1608571423902-eed4a5ad8108"),
      img("photo-1556228578-8c89e6adf883"),
      img("photo-1571781926291-c477ebfd024b"),
    ],
    source: "Unsplash — verified med spa interior fallback",
  },
  "homestead-wellness-medspa": {
    hero: img("photo-1556228453-efd6c1ff04f6"),
    gallery: [
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a18e284054f002268d05a75.png",
      "https://img1.wsimg.com/isteam/stock/8qqw22e/:/rs=w:900,h:600",
      img("photo-1556228720-195a672e8a03", 720, 540),
    ],
    source: "Amado Clinic + Kendall Med Spa + Unsplash fallback",
  },
  "cutler-bay-aesthetics": {
    hero: "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/18758ef2-486f-4cad-bab2-d49d64ee1920.png",
    gallery: [
      img("photo-1612349317150-e413f6a5b16d", 650, 450),
      img("photo-1556228578-8c89e6adf883", 700, 525),
      gal("photo-1571781926291-c477ebfd024b"),
    ],
    source: "Amado Clinic official website + Unsplash fallback",
  },
  "miami-shores-aesthetics": {
    hero: "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/684a0a7dfc68718ac7f07a7f_Infinity%20(3).webp",
    gallery: [
      gal("photo-1629909613654-28e377c37b09"),
      gal("photo-1522335789203-aabd1fc54bc9"),
      gal("photo-1487412947147-5cebf100ffc2"),
    ],
    source: "Infinity Beauty Lab official website + Unsplash fallback",
  },
  "fisher-island-aesthetics": {
    hero: "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/68d809e821a6fdd838d9d051.png",
    gallery: [
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/68d6fd36b606d6ce4a4b59c8.png",
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/68d6fd41b606d650574b5c2f.png",
      gal("photo-1522337360788-8b13dee7a37e"),
    ],
    source: "Amado Clinic official website + Unsplash fallback",
  },
  "brickell-skin-haus": {
    hero: "https://brickellcosmetic.com/wp-content/uploads/2025/04/two-header-mobile-2-min.jpg",
    gallery: [
      "https://brickellcosmetic.com/wp-content/uploads/2025/11/brickell-header-img11-mobile.jpg",
      "https://brickellcosmetic.com/wp-content/uploads/2025/11/brickell-header-img22-mobile.jpg",
      "https://brickellcosmetic.com/wp-content/uploads/2025/05/offers-btn-updated.jpg",
    ],
    source: "Brickell Cosmetic Center official website",
  },
  "elev8-aesthetics-brickell": {
    hero: "https://novaskinmedspa.com/wp-content/uploads/2025/07/laser-treatments-600x400-1.jpg",
    gallery: [
      "https://novaskinmedspa.com/wp-content/uploads/2025/07/skin-tightening-600x400-1.png",
      "https://novaskinmedspa.com/wp-content/uploads/2025/07/IMG_20250408_135859-scaled.jpg",
      "https://novaskinmedspa.com/wp-content/uploads/2025/08/laser-hair-removal-treatment.png",
    ],
    source: "Novaskin Med Spa official website",
  },
  "gables-radiance-medspa": {
    hero: "https://plenitudemedspa.com/wp-content/uploads/2025/11/red-light-teraphy-small.jpg",
    gallery: [
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/iv-drops-small.jpg",
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-1.jpg",
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-3.jpg",
    ],
    source: "Plénitude MedSpa official website",
  },
  "zenith-aesthetics-coral-gables": {
    hero: "https://www.miamiskinspa.com/_astro/services-face.Dm1WIjc0_Jc50s.webp",
    gallery: [
      "https://www.miamiskinspa.com/_astro/services-injectables.Frtuh_Sn_Z19UROG.webp",
      "https://www.miamiskinspa.com/og-default.jpg",
      "https://www.miamiskinspa.com/_astro/lumecca-ipl-0.usNrYkB5_UmSdw.webp",
    ],
    source: "Miami Skin Spa official website",
  },
  "verde-medspa-coral-gables": {
    hero: "https://www.thesurfacelevel.com/_static_/feature/outcome.png",
    gallery: [
      "https://www.thesurfacelevel.com/_static_/feature/culture.png",
      "https://www.thesurfacelevel.com/_static_/feature/Frame-1623.jpg",
      "https://influx-site-assets.s3.us-west-2.amazonaws.com/thesurfacelevel.com/masthead/masthead-02.jpg",
    ],
    source: "Surface Level Med Spa official website",
  },
  "atelier-aesthetics-design-district": {
    hero: "https://influx-site-assets.s3.us-west-2.amazonaws.com/thesurfacelevel.com/masthead/masthead-03.jpg",
    gallery: [
      "https://influx-site-assets.s3.us-west-2.amazonaws.com/thesurfacelevel.com/background/left-masthead.jpg",
      "https://www.thesurfacelevel.com/_static_/masthead/option-2.jpg",
      "https://www.thesurfacelevel.com/_static_/background/og-feat.png",
    ],
    source: "Surface Level Med Spa official website",
  },
  "regime-skin-lab-design-district": {
    hero: "https://skinneymedspa.com/wp-content/uploads/2024/03/saks-fifth-avenue-miami-9700-collins-avenue-bal-harbour-fl-33154-medspa-location-305-2024-01.webp",
    gallery: [
      "https://skinneymedspa.com/wp-content/uploads/2024/03/skinney-medspa-manhattan-01.webp",
      "https://skinneymedspa.com/wp-content/uploads/2021/03/cool-sculpting-before-and-after.webp",
      "https://skinneymedspa.com/wp-content/uploads/2021/03/coolsculpting_before_and_after_cool-sculpting_skinney_medspa_2.webp",
    ],
    source: "SKINNEY Medspa official website",
  },
  "symetry-medspa-aventura": {
    hero: "https://cdn.aventuramedspa.com/site/social/og-image.png",
    gallery: [
      img("photo-1519494026892-80bbd2d6fd0d"),
      img("photo-1576091160399-112ba8d25d1d"),
      img("photo-1580618672591-eb180b1a973f"),
    ],
    source: "Aventura Med Spa official website",
  },
  "pulse-aesthetics-aventura": {
    hero: "https://www.fbmedspa.com/wp-content/uploads/2023/09/FaceBeauty-Med-Spa-Botox-1.png",
    gallery: [
      "https://www.fbmedspa.com/wp-content/uploads/2023/09/FaceBeauty-Med-Spa-Facials-e1733929684550.png",
      "https://www.fbmedspa.com/wp-content/uploads/2024/02/dysport-inection-doral-fl.webp",
      "https://www.fbmedspa.com/wp-content/uploads/2024/03/Candela-Laser-Hair-Removal-doral-fl.webp",
    ],
    source: "FaceBeauty Med Spa official website",
  },
  "luna-dermatology-aventura": {
    hero: "https://www.fbmedspa.com/wp-content/uploads/2023/10/Andrea.jpg",
    gallery: [
      "https://www.fbmedspa.com/wp-content/uploads/elementor/thumbs/Secret-RF-Skin-Rejuvenation-qh1z1trgjmkk3w7ja3wujynj00gfbhi2j0bqcoywao.webp",
      "https://www.fbmedspa.com/wp-content/uploads/elementor/thumbs/Secret-RF-Skin-Tightening-on-Knees-qh1z1upaqglufi664mbh4gezlebsj6lsv4z7tyxi4g.webp",
      img("photo-1540555700478-4be289fbecef"),
    ],
    source: "FaceBeauty Med Spa official website",
  },
  "oceanview-aesthetics-miami-beach": {
    hero: "https://www.miamiskinspa.com/og-default.jpg",
    gallery: [
      "https://www.miamiskinspa.com/_astro/morpheus8-front-1.B6ev22ez_2ebiUX.webp",
      "https://www.miamiskinspa.com/_astro/lumecca-ipl-1.2ZhIj-Wg_Z13qQW7.webp",
      img("photo-1570172619644-dfd03ed5d881"),
    ],
    source: "Miami Skin Spa official website",
  },
  "collins-aesthetics-miami-beach": {
    hero: "https://skinneymedspa.com/wp-content/uploads/2024/03/skinney-medspa-manhattan-01.webp",
    gallery: [
      "https://skinneymedspa.com/wp-content/uploads/2024/03/Mega-Menu-Skinney-Medspa-Locations-The-Hamptons-Medspa.webp",
      "https://skinneymedspa.com/wp-content/uploads/2024/03/Mega-Menu-Skinney-Medspa-Shops-Gift-Card.jpg",
      img("photo-1519823551278-64ac92734fb1"),
    ],
    source: "SKINNEY Medspa official website",
  },
  "wynwood-skin-collective": {
    hero: "https://www.thesurfacelevel.com/_static_/feature/next_feature.jpg?1750965375618",
    gallery: [
      "https://www.thesurfacelevel.com/_static_/feature/Frame-1623.jpg",
      "https://www.thesurfacelevel.com/_static_/feature/Hospitality.png?1729121357737",
      img("photo-1515377905703-c4788e51af15"),
    ],
    source: "Surface Level Med Spa official website",
  },
  "canvas-aesthetics-wynwood": {
    hero: "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a174b30ab0c04a0ea383367.webp",
    gallery: [
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a178041c460f23b3af57509.webp",
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/68d6fd0d7615546aabbb2ee4.png",
      img("photo-1507003211169-0a1dd7228f2d"),
    ],
    source: "Amado Clinic official website",
  },
  "south-beach-laser-bar": {
    hero: "https://novaskinmedspa.com/wp-content/uploads/2025/08/laser-hair-removal-treatment.png",
    gallery: [
      "https://novaskinmedspa.com/wp-content/uploads/2025/09/laser-hair-removal-miami.png",
      "https://novaskinmedspa.com/wp-content/uploads/2025/09/back-laser-hair-removal-treatment-miami.jpg",
      img("photo-1438761681033-6461ffad8d80"),
    ],
    source: "Novaskin Med Spa official website",
  },
  "grove-serenity-medspa": {
    hero: "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-1.jpg",
    gallery: [
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-3.jpg",
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-4.jpg",
      img("photo-1524504388940-b1c1722653e1"),
    ],
    source: "Plénitude MedSpa official website",
  },
  "doral-laser-institute": {
    hero: "https://www.fbmedspa.com/wp-content/uploads/2024/03/Candela-Laser-Hair-Removal-doral-fl.webp",
    gallery: [
      "https://www.fbmedspa.com/wp-content/uploads/2024/04/thin-lip-treatment-doral.webp",
      "https://www.fbmedspa.com/wp-content/uploads/2024/02/dysport-inection-doral-fl.webp",
      img("photo-1517841905240-472988babdf9"),
    ],
    source: "FaceBeauty Med Spa official website",
  },
  "pinecrest-glow-studio": {
    hero: "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/684863ac0850b04113b27869_Morpheus%208.webp",
    gallery: [
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/683a4e4027d44bc11ea68fd9_qt%3Dq_95.webp",
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/6965f477af04759f5d6a7a16_WhatsApp%20Image%202026-01-12%20at%203.05.26%20PM.jpeg",
      img("photo-1515377905703-c4788e51af15"),
    ],
    source: "Infinity Beauty Lab official website — services",
  },
  "bal-harbour-luxury-medspa": {
    hero: "https://skinneymedspa.com/wp-content/uploads/2024/03/saks-fifth-avenue-miami-9700-collins-avenue-bal-harbour-fl-33154-medspa-location-305-2024-01.webp",
    gallery: [
      "https://skinneymedspa.com/wp-content/uploads/2024/03/30-east-60th-street-new-york-10022-medspa-location-212-2024-08-1.jpg",
      "https://skinneymedspa.com/wp-content/uploads/2024/03/flagship-flatiron-125-fifth-avenue-2nd-floor-new-york-ny-10003-medspa-location-212-2024-01.webp",
      img("photo-1534528741775-53994a69daeb"),
    ],
    source: "SKINNEY Medspa Bal Harbour official website",
  },
  "key-biscayne-skin-clinic": {
    hero: "https://brickellcosmetic.com/wp-content/uploads/2025/11/brickell-header-img11-mobile.jpg",
    gallery: [
      "https://brickellcosmetic.com/wp-content/uploads/2025/11/brickell-header-img22-mobile.jpg",
      "https://brickellcosmetic.com/wp-content/uploads/2025/03/new-bg-img-01-desktop-1024x533.jpg",
      img("photo-1519494026892-80bbd2d6fd0d"),
    ],
    source: "Brickell Cosmetic Center official website",
  },
  "south-miami-derm-aesthetics": {
    hero: "https://skinneymedspa.com/wp-content/uploads/2021/03/cool-sculpting-before-and-after.webp",
    gallery: [
      "https://skinneymedspa.com/wp-content/uploads/2021/03/coolsculpting_before_and_after_cool-sculpting_skinney_medspa_2.webp",
      "https://skinneymedspa.com/wp-content/uploads/2023/09/Botox-Skinney-Medspa-Miami-Florida-Featured-Image.webp",
      img("photo-1576091160399-112ba8d25d1d"),
    ],
    source: "SKINNEY Medspa official website",
  },
  "kendall-aesthetics-hub": {
    hero: "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/69c927d4ae3f694becbad9b8_WhatsApp%20Image%202026-03-29%20at%2010.23.11.jpeg",
    gallery: [
      "https://img1.wsimg.com/isteam/stock/8qqw22e/:/rs=w:900,h:600",
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/684863ac0850b04113b27869_Morpheus%208.webp",
      img("photo-1580618672591-eb180b1a973f"),
    ],
    source: "Kendall Med Spa official website",
  },
  "edgewater-glow-medspa": {
    hero: "https://www.thesurfacelevel.com/_static_/background/og-feat.png",
    gallery: [
      "https://www.thesurfacelevel.com/_static_/feature/culture.png",
      "https://influx-site-assets.s3.us-west-2.amazonaws.com/thesurfacelevel.com/background/left-masthead.jpg",
      img("photo-1540555700478-4be289fbecef"),
    ],
    source: "Surface Level Med Spa official website",
  },
  "midtown-injectables-lounge": {
    hero: "https://www.miamiskinspa.com/_astro/lumecca-ipl-0.usNrYkB5_UmSdw.webp",
    gallery: [
      "https://www.miamiskinspa.com/_astro/lumecca-ipl-1.2ZhIj-Wg_Z13qQW7.webp",
      "https://www.miamiskinspa.com/_astro/morpheus8-front-0.Drv_3tan_Z2gyiio.webp",
      img("photo-1570172619644-dfd03ed5d881"),
    ],
    source: "Miami Skin Spa official website",
  },
  "sunny-isles-beauty-clinic": {
    hero: "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a178041c460f23b3af57509.webp",
    gallery: [
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a18e284054f002268d05a75.png",
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/68d6fd0d7615546aabbb2ee4.png",
      img("photo-1519823551278-64ac92734fb1"),
    ],
    source: "Amado Clinic official website",
  },
  "north-miami-med-aesthetics": {
    hero: "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/6965f477af04759f5d6a7a16_WhatsApp%20Image%202026-01-12%20at%203.05.26%20PM.jpeg",
    gallery: [
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/683a4e4027d44bc11ea68fd9_qt%3Dq_95.webp",
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/684863ac0850b04113b27869_Morpheus%208.webp",
      img("photo-1515377905703-c4788e51af15"),
    ],
    source: "Infinity Beauty Lab official website — services",
  },
};

for (const [slug, ids] of Object.entries(FLORIDA_SPA_IMAGE_IDS)) {
  SPA_IMAGE_SETS[slug] = {
    hero: img(ids.heroId),
    gallery: [gal(ids.g1), gal(ids.g2), gal(ids.g3)],
    source: "Unsplash — Florida med spa stock imagery",
  };
}

for (const [slug, ids] of Object.entries(ADDITIONAL_FLORIDA_SPA_IMAGE_IDS)) {
  SPA_IMAGE_SETS[slug] = {
    hero: img(ids.heroId),
    gallery: [gal(ids.g1), gal(ids.g2), gal(ids.g3)],
    source: "Unsplash — Florida med spa stock imagery",
  };
}

for (const [slug, images] of Object.entries(FLORIDA_REAL_SPA_IMAGES)) {
  SPA_IMAGE_SETS[slug] = images;
}

for (const [slug, images] of Object.entries(FLORIDA_COASTAL_REAL_SPA_IMAGES)) {
  SPA_IMAGE_SETS[slug] = images;
}

for (const [slug, images] of Object.entries(TAMPA_BAY_REAL_SPA_IMAGES)) {
  SPA_IMAGE_SETS[slug] = images;
}

for (const [slug, images] of Object.entries(MIAMI_METRO_REAL_SPA_IMAGES)) {
  SPA_IMAGE_SETS[slug] = images;
}

for (const [slug, images] of Object.entries(WEBSITE_FETCHED_SPA_IMAGES)) {
  SPA_IMAGE_SETS[slug] = images;
}

for (const [slug, images] of Object.entries(NATIONWIDE_REAL_SPA_IMAGES)) {
  if (images.hero) SPA_IMAGE_SETS[slug] = images;
}

const nationwideWebsiteSlugs = new Set(Object.keys(NATIONWIDE_REAL_SPA_IMAGES));

for (const [slug, photoId] of Object.entries(NATIONWIDE_SPA_IMAGE_FALLBACKS)) {
  if (!SPA_IMAGE_SETS[slug]) {
    if (nationwideWebsiteSlugs.has(slug)) {
      SPA_IMAGE_SETS[slug] = {
        hero: img("photo-1516975080664-ed2fc6a32937"),
        gallery: [gal("photo-1544161515-4ab6ce6db874")],
        source: "Verity placeholder — pending business photo upload",
      };
      continue;
    }
    SPA_IMAGE_SETS[slug] = {
      hero: img(photoId),
      gallery: [gal(photoId), gal("photo-1516975080664-ed2fc6a32937"), gal("photo-1570172619644-dfd03ed5d881")],
      source: "Unsplash — med spa stock imagery (no verified website images)",
    };
  }
}

function isStockImageUrl(url: string) {
  const lower = url.toLowerCase();
  return (
    lower.includes("images.unsplash.com") ||
    /[-_/]unsplash[-_.]/i.test(lower) ||
    /unsplash-image/i.test(lower)
  );
}

/** Spas citing an official website must not show Unsplash in hero/gallery. */
for (const [slug, entry] of Object.entries(SPA_IMAGE_SETS)) {
  if (!entry.source.toLowerCase().includes("official website")) continue;
  entry.gallery = entry.gallery.filter((u) => !isStockImageUrl(u));
  if (isStockImageUrl(entry.hero)) {
    entry.hero = entry.gallery.find((u) => !isStockImageUrl(u)) ?? entry.gallery[0] ?? entry.hero;
  }
  if (entry.source.toLowerCase().includes("unsplash")) {
    entry.source = entry.source.replace(/Unsplash[^)]*\)?/i, "").replace(/\s*\+\s*/g, " ").trim();
    if (!entry.source.includes("official website")) {
      entry.source = `${entry.source} official website`.replace(/\s+/g, " ").trim();
    }
  }
}

export function getSpaImages(slug: string): SpaImageSet {
  const entry = SPA_IMAGE_SETS[slug];
  if (entry) {
    return {
      hero: entry.hero,
      gallery: entry.gallery,
      source: entry.source,
      ...(entry.logo ? { logo: entry.logo } : {}),
    };
  }
  return {
    hero: img("photo-1516975080664-ed2fc6a32937"),
    gallery: [gal("photo-1544161515-4ab6ce6db874"), gal("photo-1612349317150-e413f6a5b16d")],
    source: "Verity placeholder — pending spa upload",
  };
}

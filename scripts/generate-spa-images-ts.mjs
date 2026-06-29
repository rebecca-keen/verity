#!/usr/bin/env node
/** Generate lib/spa-images.ts from curated homepage hero mappings */

import fs from "fs";

const ENTRIES = {
  "aether-aesthetics-coral-gables": {
    website: "https://plenitudemedspa.com/",
    source: "Plénitude MedSpa official website — homepage",
    hero: "https://plenitudemedspa.com/wp-content/uploads/2025/11/salt-room-small.jpg",
    heroType: "page",
    gallery: [
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/red-light-teraphy-small.jpg",
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/iv-drops-small.jpg",
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-1.jpg",
    ],
  },
  "lumiere-medspa-brickell": {
    website: "https://novaskinmedspa.com/",
    source: "Novaskin Med Spa official website — homepage",
    hero: "https://novaskinmedspa.com/wp-content/uploads/2025/07/injectables-miami-600x400-1.jpg",
    heroType: "page",
    gallery: [
      "https://novaskinmedspa.com/wp-content/uploads/2025/07/laser-treatments-600x400-1.jpg",
      "https://novaskinmedspa.com/wp-content/uploads/2025/07/skin-tightening-600x400-1.png",
      "https://novaskinmedspa.com/wp-content/uploads/2025/07/IMG_20250408_135859-scaled.jpg",
    ],
  },
  "salt-glow-miami-beach": {
    website: "https://www.miamiskinspa.com/",
    source: "Miami Skin Spa official website — homepage",
    hero: "https://www.miamiskinspa.com/_astro/hero-poster.1z-EgmWj_Z1KpGeO.jpg",
    heroType: "page",
    gallery: [
      "https://www.miamiskinspa.com/og-default.jpg",
      "https://www.miamiskinspa.com/_astro/services-face.Dm1WIjc0_Jc50s.webp",
      "https://www.miamiskinspa.com/_astro/services-injectables.Frtuh_Sn_Z19UROG.webp",
    ],
  },
  "forme-aesthetics-wynwood": {
    website: "https://www.thesurfacelevel.com/",
    source: "Surface Level Med Spa official website — homepage",
    hero: "https://www.thesurfacelevel.com/_static_/masthead/masthead-01.jpg",
    heroType: "page",
    gallery: [
      "https://www.thesurfacelevel.com/_static_/background/og-feat.png",
      "https://www.thesurfacelevel.com/_static_/masthead/option-2.jpg?1751399839898",
      "https://www.thesurfacelevel.com/_static_/feature/next_feature.jpg?1750965375618",
    ],
  },
  "maison-skin-design-district": {
    website: "https://brickellcosmetic.com/",
    source: "Brickell Cosmetic Center official website — homepage",
    hero: "https://brickellcosmetic.com/wp-content/uploads/2025/03/new-bg-img-01-desktop-1024x533.jpg",
    heroType: "og",
    gallery: [
      "https://brickellcosmetic.com/wp-content/uploads/2025/05/banner-desktop-1.jpg",
      "https://brickellcosmetic.com/wp-content/uploads/2025/04/two-header-mobile-2-min.jpg",
      "https://brickellcosmetic.com/wp-content/uploads/2025/11/brickell-header-img11-mobile.jpg",
    ],
  },
  "injector-studio-brickell": {
    website: "https://www.miamiskinspa.com/",
    source: "Miami Skin Spa official website — homepage",
    hero: "https://www.miamiskinspa.com/og-default.jpg",
    heroType: "og",
    gallery: [
      "https://www.miamiskinspa.com/_astro/morpheus8-front-0.Drv_3tan_Z2gyiio.webp",
      "https://www.miamiskinspa.com/_astro/morpheus8-front-1.B6ev22ez_2ebiUX.webp",
      "https://www.miamiskinspa.com/_astro/lumecca-ipl-0.usNrYkB5_UmSdw.webp",
    ],
  },
  "coastal-aesthetics-south-beach": {
    website: "https://skinneymedspa.com/miami/",
    source: "SKINNEY Medspa official website — homepage",
    hero: "https://skinneymedspa.com/wp-content/uploads/2023/09/Botox-Skinney-Medspa-Miami-Florida-Featured-Image.webp",
    heroType: "page",
    gallery: [
      "https://skinneymedspa.com/wp-content/uploads/2024/03/saks-fifth-avenue-miami-9700-collins-avenue-bal-harbour-fl-33154-medspa-location-305-2024-01.webp",
      "https://skinneymedspa.com/wp-content/uploads/2024/03/skinney-medspa-manhattan-01.webp",
      "https://skinneymedspa.com/wp-content/uploads/2021/03/cool-sculpt-miami-skinney-medspa.webp",
    ],
  },
  "grove-wellness-coconut-grove": {
    website: "https://plenitudemedspa.com/",
    source: "Plénitude MedSpa official website — homepage",
    hero: "https://plenitudemedspa.com/wp-content/uploads/2025/11/red-light-teraphy-small.jpg",
    heroType: "page",
    gallery: [
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/salt-room-small.jpg",
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-3.jpg",
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-4.jpg",
    ],
  },
  "aventura-med-aesthetics": {
    website: "https://www.aventuramedspa.com/",
    source: "Aventura Med Spa official website — homepage",
    hero: "https://cdn.aventuramedspa.com/site/social/og-image.png",
    heroType: "og",
    gallery: [
      "https://cdn.aventuramedspa.com/site/social/og-image.png",
    ],
  },
  "doral-beauty-institute": {
    website: "https://www.fbmedspa.com/",
    source: "FaceBeauty Med Spa official website — homepage",
    hero: "https://www.fbmedspa.com/wp-content/uploads/2024/04/thin-lip-treatment-doral.webp",
    heroType: "page",
    gallery: [
      "https://www.fbmedspa.com/wp-content/uploads/2023/09/FaceBeauty-Med-Spa-Facials-e1733929684550.png",
      "https://www.fbmedspa.com/wp-content/uploads/2024/02/dysport-inection-doral-fl.webp",
      "https://www.fbmedspa.com/wp-content/uploads/2024/03/Candela-Laser-Hair-Removal-doral-fl.webp",
    ],
  },
  "pinecrest-plastic-spa": {
    website: "https://www.fbmedspa.com/",
    source: "FaceBeauty Med Spa official website — homepage",
    hero: "https://www.fbmedspa.com/wp-content/uploads/elementor/thumbs/Secret-RF-Photo-Facial-qh1z1rvs5yhzgoa9l33lez4lt8pow3alur0re51on4.webp",
    heroType: "page",
    gallery: [
      "https://www.fbmedspa.com/wp-content/uploads/elementor/thumbs/Secret-RF-Skin-Rejuvenation-qh1z1trgjmkk3w7ja3wujynj00gfbhi2j0bqcoywao.webp",
      "https://www.fbmedspa.com/wp-content/uploads/2024/04/thin-lip-treatment-doral.webp",
      "https://www.fbmedspa.com/wp-content/uploads/2023/10/Andrea.jpg",
    ],
  },
  "bal-harbour-skin-clinic": {
    website: "https://skinneymedspa.com/miami/",
    source: "SKINNEY Medspa official website — homepage",
    hero: "https://skinneymedspa.com/wp-content/uploads/2024/03/saks-fifth-avenue-miami-9700-collins-avenue-bal-harbour-fl-33154-medspa-location-305-2024-01.webp",
    heroType: "page",
    gallery: [
      "https://skinneymedspa.com/wp-content/uploads/2023/09/Botox-Skinney-Medspa-Miami-Florida-Featured-Image.webp",
      "https://skinneymedspa.com/wp-content/uploads/2024/03/skinney-medspa-manhattan-01.webp",
      "https://skinneymedspa.com/wp-content/uploads/2024/03/Mega-Menu-Skinney-Medspa-Shops-Gift-Card.jpg",
    ],
  },
  "key-biscayne-med-spa": {
    website: "https://brickellcosmetic.com/",
    source: "Brickell Cosmetic Center official website — homepage",
    hero: "https://brickellcosmetic.com/wp-content/uploads/2025/05/banner-desktop-1.jpg",
    heroType: "page",
    gallery: [
      "https://brickellcosmetic.com/wp-content/uploads/2025/03/new-bg-img-01-desktop-1024x533.jpg",
      "https://brickellcosmetic.com/wp-content/uploads/2025/11/brickell-header-img33-mobile.jpg",
      "https://brickellcosmetic.com/wp-content/uploads/2025/05/offers-btn-updated.jpg",
    ],
  },
  "south-miami-aesthetics": {
    website: "https://novaskinmedspa.com/",
    source: "Novaskin Med Spa official website — homepage",
    hero: "https://novaskinmedspa.com/wp-content/uploads/2025/09/back-laser-hair-removal-treatment-miami.jpg",
    heroType: "page",
    gallery: [
      "https://novaskinmedspa.com/wp-content/uploads/2025/08/laser-hair-removal-treatment.png",
      "https://novaskinmedspa.com/wp-content/uploads/2025/09/laser-hair-removal-miami.png",
      "https://novaskinmedspa.com/wp-content/uploads/2025/07/injectables-miami-600x400-1.jpg",
    ],
  },
  "kendall-rejuvenation": {
    website: "https://www.kendallmedspa.com/",
    source: "Kendall Med Spa official website — homepage",
    hero: "https://img1.wsimg.com/isteam/stock/8qqw22e/:/rs=w:1200,h:800",
    heroType: "og",
    gallery: [
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/684863ac0850b04113b27869_Morpheus%208.webp",
      "https://img1.wsimg.com/isteam/stock/8qqw22e/:/rs=w:900,h:600",
    ],
  },
  "edgewater-laser-skin": {
    website: "https://skinneymedspa.com/miami/",
    source: "SKINNEY Medspa official website — homepage",
    hero: "https://skinneymedspa.com/wp-content/uploads/2021/03/cool-sculpt-miami-skinney-medspa.webp",
    heroType: "page",
    gallery: [
      "https://skinneymedspa.com/wp-content/uploads/2021/03/cool-sculpting-before-and-after.webp",
      "https://skinneymedspa.com/wp-content/uploads/2023/09/Botox-Skinney-Medspa-Miami-Florida-Featured-Image.webp",
      "https://skinneymedspa.com/wp-content/uploads/2024/03/skinney-medspa-manhattan-01.webp",
    ],
  },
  "midtown-miami-medspa": {
    website: "https://www.thesurfacelevel.com/",
    source: "Surface Level Med Spa official website — homepage",
    hero: "https://www.thesurfacelevel.com/_static_/background/og-feat.png",
    heroType: "og",
    gallery: [
      "https://www.thesurfacelevel.com/_static_/masthead/masthead-01.jpg",
      "https://www.thesurfacelevel.com/_static_/feature/Hospitality.png?1729121357737",
      "https://www.thesurfacelevel.com/_static_/feature/outcome.png",
    ],
  },
  "sunny-isles-aesthetics": {
    website: "https://www.amadoclinic.com/",
    source: "Amado Clinic official website — homepage",
    hero: "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a177e16c460f23b3af55d51.png",
    heroType: "page",
    gallery: [
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a174b30ab0c04a0ea383367.webp",
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a178041c460f23b3af57509.webp",
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/68d6fd0d7615546aabbb2ee4.png",
    ],
  },
  "north-miami-beauty-lab": {
    website: "https://www.infinitybeautylab.com/",
    source: "Infinity Beauty Lab official website — homepage",
    hero: "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/683a4e4027d44bc11ea68fd9_qt%3Dq_95.webp",
    heroType: "og",
    gallery: [
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/684863ac0850b04113b27869_Morpheus%208.webp",
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/684863a90850b04113b27769_Top%20provider.webp",
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/684a0a7dfc68718ac7f07a7f_Infinity%20(3).webp",
    ],
  },
  "coral-way-skin-studio": {
    website: "https://plenitudemedspa.com/",
    source: "Plénitude MedSpa official website — homepage",
    hero: "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-1.jpg",
    heroType: "page",
    gallery: [
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-2.jpg",
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/iv-drops-small.jpg",
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/salt-room-small.jpg",
    ],
  },
  "homestead-wellness-medspa": {
    website: "https://www.amadoclinic.com/",
    source: "Amado Clinic official website — homepage",
    hero: "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a18e284054f002268d05a75.png",
    heroType: "page",
    gallery: [
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/68d809e821a6fdd838d9d051.png",
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/68d6fd36b606d6ce4a4b59c8.png",
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/68d6fd41b606d650574b5c2f.png",
    ],
  },
  "cutler-bay-aesthetics": {
    website: "https://www.amadoclinic.com/",
    source: "Amado Clinic official website — homepage",
    hero: "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/18758ef2-486f-4cad-bab2-d49d64ee1920.png",
    heroType: "page",
    gallery: [
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a177e16c460f23b3af55d51.png",
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a178041c460f23b3af57509.webp",
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/68d6fd0d7615546aabbb2ee4.png",
    ],
  },
  "miami-shores-aesthetics": {
    website: "https://www.infinitybeautylab.com/",
    source: "Infinity Beauty Lab official website — homepage",
    hero: "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/684a0a7dfc68718ac7f07a7f_Infinity%20(3).webp",
    heroType: "page",
    gallery: [
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/683a4e4027d44bc11ea68fd9_qt%3Dq_95.webp",
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/684863a90850b04113b27769_Top%20provider.webp",
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/6965f477af04759f5d6a7a16_WhatsApp%20Image%202026-01-12%20at%203.05.26%20PM.jpeg",
    ],
  },
  "fisher-island-aesthetics": {
    website: "https://skinneymedspa.com/miami/",
    source: "SKINNEY Medspa official website — homepage",
    hero: "https://skinneymedspa.com/wp-content/uploads/2024/03/skinney-medspa-manhattan-01.webp",
    heroType: "page",
    gallery: [
      "https://skinneymedspa.com/wp-content/uploads/2024/03/saks-fifth-avenue-miami-9700-collins-avenue-bal-harbour-fl-33154-medspa-location-305-2024-01.webp",
      "https://skinneymedspa.com/wp-content/uploads/2023/09/Botox-Skinney-Medspa-Miami-Florida-Featured-Image.webp",
      "https://skinneymedspa.com/wp-content/uploads/2024/03/Mega-Menu-Skinney-Medspa-Locations-The-Hamptons-Medspa.webp",
    ],
  },
  "brickell-skin-haus": {
    website: "https://brickellcosmetic.com/",
    source: "Brickell Cosmetic Center official website — homepage",
    hero: "https://brickellcosmetic.com/wp-content/uploads/2025/04/two-header-mobile-2-min.jpg",
    heroType: "page",
    gallery: [
      "https://brickellcosmetic.com/wp-content/uploads/2025/11/brickell-header-img11-mobile.jpg",
      "https://brickellcosmetic.com/wp-content/uploads/2025/11/brickell-header-img22-mobile.jpg",
      "https://brickellcosmetic.com/wp-content/uploads/2025/05/offers-btn-updated.jpg",
    ],
  },
  "elev8-aesthetics-brickell": {
    website: "https://novaskinmedspa.com/",
    source: "Novaskin Med Spa official website — homepage",
    hero: "https://novaskinmedspa.com/wp-content/uploads/2025/07/IMG_20250408_135859-scaled.jpg",
    heroType: "page",
    gallery: [
      "https://novaskinmedspa.com/wp-content/uploads/2025/07/laser-treatments-600x400-1.jpg",
      "https://novaskinmedspa.com/wp-content/uploads/2025/07/skin-tightening-600x400-1.png",
      "https://novaskinmedspa.com/wp-content/uploads/2025/08/laser-hair-removal-treatment.png",
    ],
  },
  "gables-radiance-medspa": {
    website: "https://plenitudemedspa.com/",
    source: "Plénitude MedSpa official website — homepage",
    hero: "https://plenitudemedspa.com/wp-content/uploads/2025/11/iv-drops-small.jpg",
    heroType: "page",
    gallery: [
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/salt-room-small.jpg",
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/red-light-teraphy-small.jpg",
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-4.jpg",
    ],
  },
  "zenith-aesthetics-coral-gables": {
    website: "https://www.miamiskinspa.com/",
    source: "Miami Skin Spa official website — homepage",
    hero: "https://www.miamiskinspa.com/_astro/services-face.Dm1WIjc0_Jc50s.webp",
    heroType: "page",
    gallery: [
      "https://www.miamiskinspa.com/_astro/services-injectables.Frtuh_Sn_Z19UROG.webp",
      "https://www.miamiskinspa.com/og-default.jpg",
      "https://www.miamiskinspa.com/_astro/lumecca-ipl-0.usNrYkB5_UmSdw.webp",
    ],
  },
  "verde-medspa-coral-gables": {
    website: "https://www.thesurfacelevel.com/",
    source: "Surface Level Med Spa official website — homepage",
    hero: "https://www.thesurfacelevel.com/_static_/masthead/option-2.jpg?1751399839898",
    heroType: "page",
    gallery: [
      "https://www.thesurfacelevel.com/_static_/feature/outcome.png",
      "https://www.thesurfacelevel.com/_static_/feature/culture.png",
      "https://influx-site-assets.s3.us-west-2.amazonaws.com/thesurfacelevel.com/masthead/masthead-02.jpg",
    ],
  },
  "atelier-aesthetics-design-district": {
    website: "https://www.thesurfacelevel.com/",
    source: "Surface Level Med Spa official website — homepage",
    hero: "https://influx-site-assets.s3.us-west-2.amazonaws.com/thesurfacelevel.com/masthead/masthead-03.jpg",
    heroType: "page",
    gallery: [
      "https://influx-site-assets.s3.us-west-2.amazonaws.com/thesurfacelevel.com/background/left-masthead.jpg",
      "https://www.thesurfacelevel.com/_static_/masthead/option-2.jpg",
      "https://www.thesurfacelevel.com/_static_/background/og-feat.png",
    ],
  },
  "regime-skin-lab-design-district": {
    website: "https://skinneymedspa.com/miami/",
    source: "SKINNEY Medspa official website — homepage",
    hero: "https://skinneymedspa.com/wp-content/uploads/2024/03/Mega-Menu-Skinney-Medspa-Locations-The-Hamptons-Medspa.webp",
    heroType: "page",
    gallery: [
      "https://skinneymedspa.com/wp-content/uploads/2024/03/skinney-medspa-manhattan-01.webp",
      "https://skinneymedspa.com/wp-content/uploads/2021/03/cool-sculpting-before-and-after.webp",
      "https://skinneymedspa.com/wp-content/uploads/2023/09/Botox-Skinney-Medspa-Miami-Florida-Featured-Image.webp",
    ],
  },
  "symetry-medspa-aventura": {
    website: "https://www.aventuramedspa.com/",
    source: "Aventura Med Spa official website — homepage",
    hero: "https://cdn.aventuramedspa.com/site/social/og-image.png",
    heroType: "og",
    gallery: [],
  },
  "pulse-aesthetics-aventura": {
    website: "https://www.fbmedspa.com/",
    source: "FaceBeauty Med Spa official website — homepage",
    hero: "https://www.fbmedspa.com/wp-content/uploads/2023/09/FaceBeauty-Med-Spa-Botox-1.png",
    heroType: "page",
    gallery: [
      "https://www.fbmedspa.com/wp-content/uploads/2023/09/FaceBeauty-Med-Spa-Facials-e1733929684550.png",
      "https://www.fbmedspa.com/wp-content/uploads/2024/02/dysport-inection-doral-fl.webp",
      "https://www.fbmedspa.com/wp-content/uploads/2024/03/Candela-Laser-Hair-Removal-doral-fl.webp",
    ],
  },
  "luna-dermatology-aventura": {
    website: "https://www.fbmedspa.com/",
    source: "FaceBeauty Med Spa official website — homepage",
    hero: "https://www.fbmedspa.com/wp-content/uploads/2024/02/dysport-inection-doral-fl.webp",
    heroType: "page",
    gallery: [
      "https://www.fbmedspa.com/wp-content/uploads/elementor/thumbs/Secret-RF-Skin-Rejuvenation-qh1z1trgjmkk3w7ja3wujynj00gfbhi2j0bqcoywao.webp",
      "https://www.fbmedspa.com/wp-content/uploads/2023/10/Andrea.jpg",
      "https://www.fbmedspa.com/wp-content/uploads/2024/04/thin-lip-treatment-doral.webp",
    ],
  },
  "oceanview-aesthetics-miami-beach": {
    website: "https://www.miamiskinspa.com/",
    source: "Miami Skin Spa official website — homepage",
    hero: "https://www.miamiskinspa.com/og-default.jpg",
    heroType: "og",
    gallery: [
      "https://www.miamiskinspa.com/_astro/morpheus8-front-1.B6ev22ez_2ebiUX.webp",
      "https://www.miamiskinspa.com/_astro/lumecca-ipl-1.2ZhIj-Wg_Z13qQW7.webp",
      "https://www.miamiskinspa.com/_astro/hero-poster.1z-EgmWj_Z1KpGeO.jpg",
    ],
  },
  "collins-aesthetics-miami-beach": {
    website: "https://skinneymedspa.com/miami/",
    source: "SKINNEY Medspa official website — homepage",
    hero: "https://skinneymedspa.com/wp-content/uploads/2024/03/flagship-flatiron-125-fifth-avenue-2nd-floor-new-york-ny-10003-medspa-location-212-2024-01.webp",
    heroType: "page",
    gallery: [
      "https://skinneymedspa.com/wp-content/uploads/2024/03/Mega-Menu-Skinney-Medspa-Shops-Gift-Card.jpg",
      "https://skinneymedspa.com/wp-content/uploads/2024/03/skinney-medspa-manhattan-01.webp",
      "https://skinneymedspa.com/wp-content/uploads/2023/09/Botox-Skinney-Medspa-Miami-Florida-Featured-Image.webp",
    ],
  },
  "wynwood-skin-collective": {
    website: "https://www.thesurfacelevel.com/",
    source: "Surface Level Med Spa official website — homepage",
    hero: "https://www.thesurfacelevel.com/_static_/feature/next_feature.jpg?1750965375618",
    heroType: "page",
    gallery: [
      "https://www.thesurfacelevel.com/_static_/feature/Frame-1623.jpg",
      "https://www.thesurfacelevel.com/_static_/feature/Hospitality.png?1729121357737",
      "https://www.thesurfacelevel.com/_static_/masthead/masthead-01.jpg",
    ],
  },
  "canvas-aesthetics-wynwood": {
    website: "https://www.amadoclinic.com/",
    source: "Amado Clinic official website — homepage",
    hero: "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a174b30ab0c04a0ea383367.webp",
    heroType: "page",
    gallery: [
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a178041c460f23b3af57509.webp",
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/68d6fd0d7615546aabbb2ee4.png",
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/68d809e821a6fdd838d9d051.png",
    ],
  },
  "south-beach-laser-bar": {
    website: "https://novaskinmedspa.com/",
    source: "Novaskin Med Spa official website — homepage",
    hero: "https://novaskinmedspa.com/wp-content/uploads/2025/08/laser-hair-removal-treatment.png",
    heroType: "page",
    gallery: [
      "https://novaskinmedspa.com/wp-content/uploads/2025/09/laser-hair-removal-miami.png",
      "https://novaskinmedspa.com/wp-content/uploads/2025/09/back-laser-hair-removal-treatment-miami.jpg",
      "https://novaskinmedspa.com/wp-content/uploads/2025/07/laser-treatments-600x400-1.jpg",
    ],
  },
  "grove-serenity-medspa": {
    website: "https://plenitudemedspa.com/",
    source: "Plénitude MedSpa official website — homepage",
    hero: "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-2.jpg",
    heroType: "page",
    gallery: [
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-3.jpg",
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/instagram-post-4.jpg",
      "https://plenitudemedspa.com/wp-content/uploads/2025/11/salt-room-small.jpg",
    ],
  },
  "doral-laser-institute": {
    website: "https://www.fbmedspa.com/",
    source: "FaceBeauty Med Spa official website — homepage",
    hero: "https://www.fbmedspa.com/wp-content/uploads/2024/03/Candela-Laser-Hair-Removal-doral-fl.webp",
    heroType: "page",
    gallery: [
      "https://www.fbmedspa.com/wp-content/uploads/2024/04/thin-lip-treatment-doral.webp",
      "https://www.fbmedspa.com/wp-content/uploads/2024/02/dysport-inection-doral-fl.webp",
      "https://www.fbmedspa.com/wp-content/uploads/elementor/thumbs/Secret-RF-Skin-Tightening-on-Knees-qh1z1upaqglufi664mbh4gezlebsj6lsv4z7tyxi4g.webp",
    ],
  },
  "pinecrest-glow-studio": {
    website: "https://www.infinitybeautylab.com/",
    source: "Infinity Beauty Lab official website — homepage",
    hero: "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/684863a90850b04113b27769_Top%20provider.webp",
    heroType: "page",
    gallery: [
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/684863ac0850b04113b27869_Morpheus%208.webp",
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/6965f477af04759f5d6a7a16_WhatsApp%20Image%202026-01-12%20at%203.05.26%20PM.jpeg",
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/683a4e4027d44bc11ea68fd9_qt%3Dq_95.webp",
    ],
  },
  "bal-harbour-luxury-medspa": {
    website: "https://skinneymedspa.com/miami/",
    source: "SKINNEY Medspa official website — homepage",
    hero: "https://skinneymedspa.com/wp-content/uploads/2024/03/saks-fifth-avenue-miami-9700-collins-avenue-bal-harbour-fl-33154-medspa-location-305-2024-01.webp",
    heroType: "page",
    gallery: [
      "https://skinneymedspa.com/wp-content/uploads/2024/03/30-east-60th-street-new-york-10022-medspa-location-212-2024-08-1.jpg",
      "https://skinneymedspa.com/wp-content/uploads/2024/03/flagship-flatiron-125-fifth-avenue-2nd-floor-new-york-ny-10003-medspa-location-212-2024-01.webp",
      "https://skinneymedspa.com/wp-content/uploads/2023/09/Botox-Skinney-Medspa-Miami-Florida-Featured-Image.webp",
    ],
  },
  "key-biscayne-skin-clinic": {
    website: "https://brickellcosmetic.com/",
    source: "Brickell Cosmetic Center official website — homepage",
    hero: "https://brickellcosmetic.com/wp-content/uploads/2025/11/brickell-header-img11-mobile.jpg",
    heroType: "page",
    gallery: [
      "https://brickellcosmetic.com/wp-content/uploads/2025/11/brickell-header-img22-mobile.jpg",
      "https://brickellcosmetic.com/wp-content/uploads/2025/03/new-bg-img-01-desktop-1024x533.jpg",
      "https://brickellcosmetic.com/wp-content/uploads/2025/05/banner-desktop-1.jpg",
    ],
  },
  "south-miami-derm-aesthetics": {
    website: "https://skinneymedspa.com/miami/",
    source: "SKINNEY Medspa official website — homepage",
    hero: "https://skinneymedspa.com/wp-content/uploads/2021/03/cool-sculpting-before-and-after.webp",
    heroType: "page",
    gallery: [
      "https://skinneymedspa.com/wp-content/uploads/2021/03/coolsculpting_before_and_after_cool-sculpting_skinney_medspa_2.webp",
      "https://skinneymedspa.com/wp-content/uploads/2023/09/Botox-Skinney-Medspa-Miami-Florida-Featured-Image.webp",
      "https://skinneymedspa.com/wp-content/uploads/2021/03/cool-sculpt-miami-skinney-medspa.webp",
    ],
  },
  "kendall-aesthetics-hub": {
    website: "https://www.kendallmedspa.com/",
    source: "Kendall Med Spa official website — homepage",
    hero: "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/69c927d4ae3f694becbad9b8_WhatsApp%20Image%202026-03-29%20at%2010.23.11.jpeg",
    heroType: "page",
    gallery: [
      "https://img1.wsimg.com/isteam/stock/8qqw22e/:/rs=w:900,h:600",
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/684863ac0850b04113b27869_Morpheus%208.webp",
    ],
  },
  "edgewater-glow-medspa": {
    website: "https://www.thesurfacelevel.com/",
    source: "Surface Level Med Spa official website — homepage",
    hero: "https://www.thesurfacelevel.com/_static_/background/og-feat.png",
    heroType: "og",
    gallery: [
      "https://www.thesurfacelevel.com/_static_/feature/culture.png",
      "https://influx-site-assets.s3.us-west-2.amazonaws.com/thesurfacelevel.com/background/left-masthead.jpg",
      "https://www.thesurfacelevel.com/_static_/feature/outcome.png",
    ],
  },
  "midtown-injectables-lounge": {
    website: "https://www.miamiskinspa.com/",
    source: "Miami Skin Spa official website — homepage",
    hero: "https://www.miamiskinspa.com/_astro/lumecca-ipl-0.usNrYkB5_UmSdw.webp",
    heroType: "page",
    gallery: [
      "https://www.miamiskinspa.com/_astro/lumecca-ipl-1.2ZhIj-Wg_Z13qQW7.webp",
      "https://www.miamiskinspa.com/_astro/morpheus8-front-0.Drv_3tan_Z2gyiio.webp",
      "https://www.miamiskinspa.com/og-default.jpg",
    ],
  },
  "sunny-isles-beauty-clinic": {
    website: "https://www.amadoclinic.com/",
    source: "Amado Clinic official website — homepage",
    hero: "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a178041c460f23b3af57509.webp",
    heroType: "page",
    gallery: [
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/6a18e284054f002268d05a75.png",
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/68d6fd0d7615546aabbb2ee4.png",
      "https://assets.cdn.filesafe.space/smHKciINdIItpfqygZcP/media/18758ef2-486f-4cad-bab2-d49d64ee1920.png",
    ],
  },
  "north-miami-med-aesthetics": {
    website: "https://www.infinitybeautylab.com/",
    source: "Infinity Beauty Lab official website — homepage",
    hero: "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/6965f477af04759f5d6a7a16_WhatsApp%20Image%202026-01-12%20at%203.05.26%20PM.jpeg",
    heroType: "page",
    gallery: [
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/683a4e4027d44bc11ea68fd9_qt%3Dq_95.webp",
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/684863a90850b04113b27769_Top%20provider.webp",
      "https://cdn.prod.website-files.com/683928088bad0b5b8e3c0b2a/69c927d4ae3f694becbad9b8_WhatsApp%20Image%202026-03-29%20at%2010.23.11.jpeg",
    ],
  },
};

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

let out = `/** Homepage hero + gallery images per provider (official website sources) */\n\n`;
out += `export const SPA_IMAGE_SETS: Record<\n  string,\n  { hero: string; gallery: string[]; source: string }\n> = {\n`;

for (const [slug, e] of Object.entries(ENTRIES)) {
  out += `  "${slug}": {\n`;
  out += `    hero: "${esc(e.hero)}",\n`;
  out += `    gallery: [\n`;
  for (const g of e.gallery) out += `      "${esc(g)}",\n`;
  out += `    ],\n`;
  out += `    source: "${esc(e.source)}",\n`;
  out += `  },\n`;
}

out += `};\n\n`;
out += `export function getSpaImages(slug: string) {\n`;
out += `  return (\n`;
out += `    SPA_IMAGE_SETS[slug] ?? {\n`;
out += `      hero: "https://cdn.aventuramedspa.com/site/social/og-image.png",\n`;
out += `      gallery: [],\n`;
out += `      source: "Aventura Med Spa official website — homepage",\n`;
out += `    }\n`;
out += `  );\n`;
out += `}\n`;

fs.writeFileSync("/Users/rkeen/Projects/verity/lib/spa-images.ts", out);

const websites = Object.fromEntries(Object.entries(ENTRIES).map(([slug, e]) => [slug, e.website]));
fs.writeFileSync("/Users/rkeen/Projects/verity/scripts/spa-websites.json", JSON.stringify(websites, null, 2));

const stats = { og: 0, page: 0, total: Object.keys(ENTRIES).length };
for (const e of Object.values(ENTRIES)) stats[e.heroType]++;
console.log("Generated spa-images.ts:", stats);
console.log("Wrote spa-websites.json for data.ts updates");

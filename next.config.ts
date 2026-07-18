import type { NextConfig } from "next";

/**
 * Image hosts: CDN wildcards cover most med spa assets.
 * Provider hero/gallery images use native <img> via RemoteImage (195+ root domains — exceeds the 50-pattern cap).
 * next/image remotePatterns covers product photos from Amazon and authorized retailer CDNs.
 */
const skinLaundrySlugRedirects = [
  ["skin-laundry-los-los-angeles", "skin-laundry-manhattan-beach-los-angeles"],
  ["skin-laundry-los-los-angeles-2", "skin-laundry-pasadena-los-angeles"],
  ["skin-laundry-los-los-angeles-3", "skin-laundry-irvine-irvine"],
  ["skin-laundry-san-san-diego", "skin-laundry-downtown-san-diego"],
  ["skin-laundry-san-san-diego-2", "skin-laundry-la-jolla-san-diego"],
  ["skin-laundry-san-san-francisco", "skin-laundry-downtown-san-francisco"],
  ["skin-laundry-san-san-jose", "skin-laundry-willow-glen-san-jose"],
  ["skin-laundry-palo-palo-alto", "skin-laundry-downtown-palo-alto"],
  ["skin-laundry-walnut-walnut-creek", "skin-laundry-downtown-walnut-creek"],
  ["skin-laundry-scottsdale-scottsdale", "skin-laundry-old-town-scottsdale"],
  ["skin-laundry-dallas-dallas", "skin-laundry-uptown-dallas"],
  ["skin-laundry-houston-houston", "skin-laundry-galleria-houston"],
  ["skin-laundry-austin-austin", "skin-laundry-downtown-austin"],
  ["skin-laundry-chicago-chicago", "skin-laundry-river-north-chicago"],
  ["skin-laundry-new-new-york", "skin-laundry-flatiron-new-york"],
  ["skin-laundry-nyc-new-york", "skin-laundry-midtown-new-york"],
  ["skin-laundry-boston-boston", "skin-laundry-back-bay-boston"],
  ["skin-laundry-seattle-seattle", "skin-laundry-capitol-hill-seattle"],
  ["skin-laundry-denver-denver", "skin-laundry-lodo-denver"],
  ["skin-laundry-denver-denver-2", "skin-laundry-boulder-boulder"],
  ["skin-laundry-atlanta-atlanta", "skin-laundry-buckhead-atlanta"],
  ["skin-laundry-miami-miami", "skin-laundry-brickell-miami"],
  ["skin-laundry-nashville-nashville", "skin-laundry-gulch-nashville"],
  ["skin-laundry-charlotte-charlotte", "skin-laundry-southpark-charlotte"],
  ["skin-laundry-philadelphia-philadelphia", "skin-laundry-rittenhouse-philadelphia"],
  ["skin-laundry-washington-washington", "skin-laundry-georgetown-washington"],
  ["skin-laundry-washington-washington-2", "skin-laundry-bethesda-bethesda"],
  ["skin-laundry-washington-washington-3", "skin-laundry-tysons-tysons"],
  ["skin-laundry-las-las-vegas", "skin-laundry-summerlin-las-vegas"],
  ["skin-laundry-portland-portland", "skin-laundry-pearl-district-portland"],
  ["skin-laundry-newport-newport-beach", "skin-laundry-fashion-island-newport-beach"],
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/products/recommended", destination: "/shop", permanent: true },
      { source: "/products", destination: "/shop", permanent: true },
      { source: "/products/:slug", destination: "/shop/:slug", permanent: true },
      { source: "/spas", destination: "/providers", permanent: true },
      { source: "/spas/:slug", destination: "/providers/:slug", permanent: true },
      ...skinLaundrySlugRedirects.map(([from, to]) => ({
        source: `/providers/${from}`,
        destination: `/providers/${to}`,
        permanent: true,
      })),
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "epicutis.com" },
      { protocol: "https", hostname: "bluemercury.com" },
      { protocol: "https", hostname: "www.dermstore.com" },
      { protocol: "https", hostname: "static.thcdn.com" },
      { protocol: "https", hostname: "www.skinceuticals.com" },
      { protocol: "https", hostname: "www.skinmedica.com" },
      { protocol: "https", hostname: "www.eltamd.com" },
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.squarespace.com" },
      { protocol: "http", hostname: "**.squarespace.com" },
      { protocol: "https", hostname: "**.squarespace-cdn.com" },
      { protocol: "https", hostname: "**.wp.com" },
      { protocol: "https", hostname: "**.wixstatic.com" },
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "**.cdn-website.com" },
      { protocol: "https", hostname: "**.websitepro-cdn.com" },
      { protocol: "https", hostname: "**.website-files.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.shopify.com" },
      { protocol: "https", hostname: "assets.cdn.filesafe.space" },
      { protocol: "https", hostname: "img1.wsimg.com" },
      { protocol: "https", hostname: "datocms-assets.com" },
      { protocol: "https", hostname: "content.app-sources.com" },
      { protocol: "https", hostname: "**.pcdn.co" },
      { protocol: "https", hostname: "i.ytimg.com" },
      // High-traffic direct WordPress hosts (also covered by RemoteImage native img fallback)
      { protocol: "https", hostname: "skinneymedspa.com" },
      { protocol: "https", hostname: "plenitudemedspa.com" },
      { protocol: "https", hostname: "www.miamiskinspa.com" },
      { protocol: "https", hostname: "novaskinmedspa.com" },
      { protocol: "https", hostname: "brickellcosmetic.com" },
      { protocol: "https", hostname: "www.fbmedspa.com" },
      { protocol: "https", hostname: "livingyoungcenter.com" },
      { protocol: "https", hostname: "www.thesurfacelevel.com" },
      { protocol: "https", hostname: "olympiaaesthetics.com" },
      { protocol: "https", hostname: "jaxaestheticscenter.com" },
      { protocol: "https", hostname: "www.luxeroomcosmetic.com" },
      { protocol: "https", hostname: "luxeroomcosmetic.com" },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

/**
 * Image hosts: CDN wildcards cover most med spa assets.
 * Provider hero/gallery images use native <img> via RemoteImage (195+ root domains — exceeds the 50-pattern cap).
 * next/image + remotePatterns is used for Unsplash product/placeholder images only.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
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

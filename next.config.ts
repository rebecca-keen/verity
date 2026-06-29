import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plenitudemedspa.com" },
      { protocol: "https", hostname: "www.miamiskinspa.com" },
      { protocol: "https", hostname: "miamiskinspa.com" },
      { protocol: "https", hostname: "www.thesurfacelevel.com" },
      { protocol: "https", hostname: "brickellcosmetic.com" },
      { protocol: "https", hostname: "skinneymedspa.com" },
      { protocol: "https", hostname: "novaskinmedspa.com" },
      { protocol: "https", hostname: "cdn.aventuramedspa.com" },
      { protocol: "https", hostname: "www.fbmedspa.com" },
      { protocol: "https", hostname: "cdn.prod.website-files.com" },
      { protocol: "https", hostname: "assets.cdn.filesafe.space" },
      { protocol: "https", hostname: "img1.wsimg.com" },
      {
        protocol: "https",
        hostname: "influx-site-assets.s3.us-west-2.amazonaws.com",
      },
      { protocol: "https", hostname: "**.cdninstagram.com" },
    ],
  },
};

export default nextConfig;

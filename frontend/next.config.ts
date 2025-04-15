import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
      {
        protocol: "https",
        hostname: "marketup.com", 
      },
    ],
    domains: ["image.tmdb.org", "i.scdn.co", "marketup.com"], 
  },
};

export default nextConfig;

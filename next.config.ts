import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from any external domain
    // This is useful for user-uploaded images stored in S3, CDNs, etc.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "grandiose-chicken-156.convex.cloud", // Whitelisted domain
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.4'],
  images: {
    // portfolio media changes rarely; keep optimized variants cached for 30 days
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;

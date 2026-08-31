import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.4'],
  images: {
    // portfolio media changes rarely; keep optimized variants cached for 30 days
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // fewer srcset rungs: lighter HTML, smaller DOM attr weight
    deviceSizes: [640, 750, 1080, 1920],
    imageSizes: [256, 384],
  },
};

export default nextConfig;

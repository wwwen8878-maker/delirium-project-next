import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React 19 support
    reactCompiler: false,
  },
  // Ensure React 19 compatibility
  transpilePackages: [],
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

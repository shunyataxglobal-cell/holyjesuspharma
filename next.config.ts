import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Trust proxy headers from Cloudflare/Vercel
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;

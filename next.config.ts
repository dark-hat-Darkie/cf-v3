import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    proxyClientMaxBodySize: "15mb",
    serverActions: {
      bodySizeLimit: "5mb",
      allowedOrigins:
        process.env.ALLOWED_ORIGINS?.split(",").filter(Boolean) ?? [],
    },
  },
  serverExternalPackages: ["@node-rs/argon2", "sharp"],
};

export default nextConfig;

import type { NextConfig } from "next";

// The site is served from a domain root on shared hosting, so this defaults to
// empty. Set BASE_PATH only to publish under a subdirectory.
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Hide the floating Next.js dev tools indicator.
  devIndicators: false,
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

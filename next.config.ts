import type { NextConfig } from "next";

// GitHub Pages serves the custom domain (kangkan.in) from its root, so this
// stays empty. Set BASE_PATH only to publish under a subdirectory, such as a
// project page at /My-Portfolio.
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

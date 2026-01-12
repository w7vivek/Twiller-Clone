import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // REQUIRED for GitHub Pages (static export)
  output: "export",

  // REQUIRED because GitHub Pages serves from /Twiller-Clone
  basePath: "/Twiller-Clone",

  // REQUIRED because Next Image Optimization does not work on GitHub Pages
  images: {
    unoptimized: true,
  },

  // Your existing env config (this is fine)
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },

  // Ignore ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  // repo name
  basePath: "/Twiller-Clone",

  // VERY IMPORTANT for GitHub Pages
  assetPrefix: "/Twiller-Clone/",

  images: {
    unoptimized: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

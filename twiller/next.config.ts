import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",                 // REQUIRED
  basePath: "/Twiller-Clone",        // repo name
  images: {
    unoptimized: true,              // REQUIRED for GitHub Pages
  },
  env: {
    BACKEND_URL: "https://twiller-clone-pqr3.onrender.com",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

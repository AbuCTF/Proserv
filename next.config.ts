import type { NextConfig } from "next";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Image config to prevent issues
  images: {
    domains: [], // Optional — only needed if using remote images
    unoptimized: false,
  },
};

export default nextConfig;

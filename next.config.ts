import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  turbopack: {
    // Pin the Turbopack workspace root to this project. A stray
    // package-lock.json in C:\Users\anton confuses Turbopack's auto-detection
    // and causes external module resolution to fail during production builds.
    root: path.join(__dirname),
  },
};

export default nextConfig;

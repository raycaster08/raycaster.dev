import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      { hostname: 'picsum.photos' },
      { hostname: 'pub-453046b01176489fa5d7cb4c951fa8d9.r2.dev' },
      { hostname: 'www.notion.so' },
      { hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
      { hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "carenest-storage.ap-south-1.storage.onantryk.com",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev-carenest.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;

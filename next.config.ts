import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "creative-story.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;

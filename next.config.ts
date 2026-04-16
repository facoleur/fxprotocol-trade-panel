import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors https://www.notion.so https://notion.site;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

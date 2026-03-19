/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: ""
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: ""
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
        port: ""
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: ""
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: ""
      }
    ]
  },
  async rewrites() {
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiUrl}/api/v1/:path*`, // Proxy to Spring Boot Backend
      },
    ];
  },
};

export default nextConfig;

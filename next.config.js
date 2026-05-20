/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sobkisubazar.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
  // Performance optimizations
  compress: true,
  productionBrowserSourceMaps: false,
  // Disable experimental features that can cause dev server instability
  experimental: {},
};

module.exports = nextConfig;

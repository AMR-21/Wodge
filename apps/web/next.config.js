//@ts-nocheck

const { setupDevPlatform } = require("@cloudflare/next-on-pages/next-dev");

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  transpilePackages: ["@radix-ui"],
  typescript: {
    // ignoreBuildErrors: true,
  },
  experimental: {
    // typedRoutes: true,
  },
});

/**
 * Add Cloudflare bindings for Next.js development mode.
 */

(async () => {
  if (process.env.NODE_ENV === "development") {
    await setupDevPlatform();
  }
})();

module.exports = nextConfig;

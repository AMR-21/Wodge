import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
await import("./node_modules/@repo/env/index.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@radix-ui"],
};

/**
 * Add Cloudflare bindings for Next.js development mode.
 */

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;

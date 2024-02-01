await import("./lib/env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@radix-ui"],
};

/**
 * Add Cloudflare bindings for Next.js development mode.
 */

if (process.env.NODE_ENV === "development") {
  const { setupDevBindings } = require("@cloudflare/next-on-pages/next-dev");

  setupDevBindings({
    bindings: {
      DB: {
        type: "d1",
        databaseId: "DB",
      },
    },
  });
}

export default nextConfig;

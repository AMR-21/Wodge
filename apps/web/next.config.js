import { setupDevBindings } from "@cloudflare/next-on-pages/next-dev";
await import("./lib/env.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@radix-ui"],
};

/**
 * Add Cloudflare bindings for Next.js development mode.
 */

if (process.env.NODE_ENV === "development") {
  await setupDevBindings({
    bindings: {
      DB: {
        type: "d1",
        databaseId: "DB",
      },
    },
  });
}

export default nextConfig;

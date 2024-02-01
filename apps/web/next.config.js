await import("./lib/env.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@radix-ui"],
};

/**
 * Add Cloudflare bindings for Next.js development mode.
 */

if (process.env.NODE_ENV === "development") {
  import("@cloudflare/next-on-pages/next-dev").then(({ setupDevBindings }) => {
    setupDevBindings({
      bindings: {
        DB: {
          type: "d1",
          databaseName: "DB",
        },
      },
    });
  });
}

export default nextConfig;

import { setupDevBindings } from "@cloudflare/next-on-pages/next-dev";
await import("./src/lib/env.js");

// const headers = [
//   "Accept",
//   "Accept-Version",
//   "Content-Length",
//   "Content-MD5",
//   "Content-Type",
//   "Date",
//   "X-Api-Version",
//   "X-CSRF-Token",
//   "X-Requested-With",
// ];

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@radix-ui"],
  // env: {
  //   ALLOWED_NEXT_AUTH_URLS: [
  //     "http://(.+\\.|)localhost:3000/?",
  //     "http://(.+\\.|)localhost:1999/?",
  //   ],
  //   ALLOWED_HEADERS: headers.join(", "),
  //   CORS_DEFAULTS: {
  //     methods: [], // making this blank by default - you have to override it per-call
  //     origin: "*",
  //     allowedHeaders: headers.join(", "),
  //     credentials: true,
  //   },
  // },
  // async headers() {
  //   return [
  //     {
  //       source: "/api/(.*)",
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         { key: "Access-Control-Allow-Origin", value: "*" },
  //         {
  //           key: "Access-Control-Allow-Methods",
  //           value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  //         },
  //         {
  //           key: "Access-Control-Allow-Headers",
  //           value: headers.join(", "),
  //         },
  //       ],
  //     },
  //   ];
  // },
  // rewrites: async () => [
  //   {
  //     // forward room authentication request to partykit
  //     source: "/me",
  //     // include connection id in the query
  //     destination: "https://backend.amr-21.partykit.dev" + "/parties/main/id",
  //   },
  // ],
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

import type { Config } from "drizzle-kit";
import crypto from "node:crypto";

const DB_HOST = "local";

const baseConfig: Partial<Config> = {
  schema: "./data/schemas/*.schema.ts",
  out: "./data/migrations",
};

export default DB_HOST === "local"
  ? ({
      ...baseConfig,
      driver: "better-sqlite",
      dbCredentials: {
        url: `./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/${mfIdFromName(
          "miniflare-D1DatabaseObject",
          "DB",
        )}.sqlite`,
      },
    } satisfies Config)
  : ({
      ...baseConfig,
      driver: "d1",
      dbCredentials: {
        wranglerConfigPath: "./wrangler.toml",
        dbName: "wodge-db",
      },
    } satisfies Config);

/**
 * Generates a unique id generated by miniflare for a binding
 * https://github.com/cloudflare/miniflare/releases/tag/v3.20230918.0
 */
type UniqueKey =
  | "miniflare-KVNamespaceObject"
  | "miniflare-R2BucketObject"
  | "miniflare-D1DatabaseObject"
  | "miniflare-CacheObject";

function mfIdFromName(uniqueKey: UniqueKey, binding: string) {
  const key = crypto.createHash("sha256").update(uniqueKey).digest();
  const bindingHmac = crypto
    .createHmac("sha256", key)
    .update(binding)
    .digest()
    .subarray(0, 16);
  const hmac = crypto
    .createHmac("sha256", key)
    .update(bindingHmac)
    .digest()
    .subarray(0, 16);
  return Buffer.concat([bindingHmac, hmac]).toString("hex");
}

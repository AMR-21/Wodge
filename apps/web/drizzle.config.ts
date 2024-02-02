/**
 * Config file for drizzle studio
 * Works on local DB only on windows
 * Should work fine on linux
 */
import type { Config } from "drizzle-kit";
import { mfIdFromName } from "./lib/utils";
import { env } from "./lib/env.js";

const schemaPath = "./node_modules/@repo/data/schemas/*.schema.ts";

export default env.DB_HOST === "local"
  ? ({
      schema: schemaPath,
      driver: "better-sqlite",
      dbCredentials: {
        url: `./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/${mfIdFromName(
          "miniflare-D1DatabaseObject",
          "DB"
        )}.sqlite`,
      },
    } satisfies Config)
  : ({
      schema: schemaPath,
      driver: "d1",
      dbCredentials: {
        wranglerConfigPath: "./wrangler.toml",
        dbName: "wodge-db",
      },
    } satisfies Config);

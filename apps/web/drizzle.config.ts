/**
 * Config file for drizzle studio
 * Works on local DB only on windows
 * Should work fine on linux
 */
import type { Config } from "drizzle-kit";
import { mfIdFromName } from "./lib/utils";
import { env } from "@repo/env";

export default env?.DB_HOST === "local"
  ? ({
      schema: "./node_modules/@repo/db/schema.ts",
      driver: "better-sqlite",
      dbCredentials: {
        url: `./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/${mfIdFromName(
          "miniflare-D1DatabaseObject",
          "DB"
        )}.sqlite`,
      },
    } satisfies Config)
  : ({
      schema: "./node_modules/@repo/db/schema.ts",
      driver: "d1",
      dbCredentials: {
        wranglerConfigPath: "./wrangler.toml",
        dbName: "wodge-db",
      },
    } satisfies Config);

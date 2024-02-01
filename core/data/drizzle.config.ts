/**
 * Config file for drizzle migrations
 */
import type { Config } from "drizzle-kit";

export default {
  schema: "./schemas/db-schema.ts",
  out: "./migrations",
} satisfies Config;

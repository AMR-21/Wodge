/**
 * Config file for drizzle migrations
 */
import type { Config } from "drizzle-kit";

export default {
  schema: "./schemas/*.schema.ts",
  out: "./migrations",
} satisfies Config;

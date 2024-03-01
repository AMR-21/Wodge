import type { Config } from "drizzle-kit";

export default {
  schema: "./schemas/auth.schema.ts",
  out: "./migrations",
  driver: "d1",
} satisfies Config;

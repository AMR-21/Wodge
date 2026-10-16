import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./schemas/auth.schema.ts", "./schemas/workspace.schema.ts"],
  out: "./migrations",
  dialect: "sqlite",
});

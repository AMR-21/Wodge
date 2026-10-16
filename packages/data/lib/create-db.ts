import { drizzle } from "drizzle-orm/d1";
import * as authSchema from "../schemas/auth.schema";
import { workspaces, memberships } from "../schemas/workspace.schema";
import type { D1Database } from "@cloudflare/workers-types";

export function createDb(binding: D1Database) {
  return drizzle(binding, {
    schema: { ...authSchema, workspaces, memberships },
  });
}

export type DataDb = ReturnType<typeof createDb>;

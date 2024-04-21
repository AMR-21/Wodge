import { drizzle } from "drizzle-orm/d1";
import * as authSchema from "../schemas/auth.schema";
import { workspaces, memberships } from "../schemas/workspace.schema";
import { getRequestContext } from "@cloudflare/next-on-pages";

export function createDb() {
  const { env } = getRequestContext();

  return drizzle(env.DB, {
    schema: { ...authSchema, workspaces, memberships },
  });
}

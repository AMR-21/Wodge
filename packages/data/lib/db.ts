import { drizzle } from "drizzle-orm/d1";
import * as authSchema from "../schemas/auth.schema";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { workspaces, memberships } from "../schemas/workspace.schema";

const { env } = getRequestContext();

export const db = drizzle(env.DB, {
  schema: { ...authSchema, workspaces, memberships },
});

import { drizzle } from "drizzle-orm/d1";
import * as authSchema from "../schemas/auth.schema";
import { getRequestContext } from "@cloudflare/next-on-pages";

const { env } = getRequestContext();

export const db = drizzle(env.DB, {
  schema: { ...authSchema },
});

import "server-only";
import { drizzle } from "drizzle-orm/d1";
import * as authSchema from "@/data/schemas/auth.schema";
import * as dbSchema from "@/data/schemas/db.schema";

export const db = drizzle(process.env.DB, {
  schema: { ...authSchema, ...dbSchema },
});

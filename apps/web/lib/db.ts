import { drizzle } from "drizzle-orm/d1";
import { authSchema, dbSchema } from "@repo/data";

export const db = drizzle(process.env.DB, {
  schema: { ...authSchema, ...dbSchema },
});

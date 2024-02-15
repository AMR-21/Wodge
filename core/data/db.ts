import { drizzle } from "drizzle-orm/d1";
import * as authSchema from "./schemas/auth.schema";

export const db = drizzle(process.env.DB, {
  schema: { ...authSchema },
});

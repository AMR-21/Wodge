import { drizzle } from "drizzle-orm/d1";

import * as dbSchema from "./schemas/db.schema";
import * as authSchema from "./schemas/auth.schema";

export * as dbSchema from "./schemas/db.schema";
export * as authSchema from "./schemas/auth.schema";
export * from "./schemas/db.schema";
export * from "./schemas/auth.schema";
export * from "./schemas/profile";
export * from "./models/users";

export const db = drizzle(process.env.DB, {
  schema: { ...authSchema, ...dbSchema },
});

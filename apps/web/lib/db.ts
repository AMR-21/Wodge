import { drizzle } from "drizzle-orm/d1";
import { schema } from "@repo/data";

export const db = drizzle(process.env.DB, { schema });

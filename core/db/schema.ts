import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const countries = sqliteTable("countries", {
  name: text("name").$defaultFn(() => "Egypt"),
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  n2: text("n2").$defaultFn(() => "EG"),
});

import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const users = sqliteTable("users", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$default(() => nanoid()),
  email: text("email").unique().notNull(),
  displayName: text("display_name"),
  avatar: text("avatar"),
  username: text("username").unique(),
  // emailVerified: integer("email_verified", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
});

export type UserType = typeof users.$inferSelect;

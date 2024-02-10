import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

import { users } from "./auth.schema";

export const profiles = sqliteTable("profiles", {
  userId: text("user_id")
    .notNull()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  username: text("username").unique(),
  avatar: text("avatar"),
  updatedAt: integer("created_at", { mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
});

// A profile corresponds to a single user
export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

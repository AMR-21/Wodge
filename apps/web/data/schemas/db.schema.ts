import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

import { users } from "./auth.schema";
import { z } from "zod";

export const profiles = sqliteTable("profiles", {
  userId: text("user_id")
    .notNull()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  username: text("username").unique(),
  avatar: text("avatar"),
  bio: text("bio", { length: 512 }),
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

export const ProfileSchema = createInsertSchema(profiles, {
  userId: z.never(),
  updatedAt: z.never(),
  username: z.string().max(10).min(3),
  displayName: z.string().max(70),
  avatar: z.string().url().optional(),
  bio: z.string().max(512).optional(),
});

export type Profile = typeof profiles.$inferSelect | null | undefined;
export type NewProfile = typeof profiles.$inferInsert;

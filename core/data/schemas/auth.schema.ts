import {
  integer,
  sqliteTable,
  text,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccount } from "@auth/core/adapters";

export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull(),
  // hasProfile: integer("has_profile", { mode: "boolean" }).default(false),
  displayName: text("name"),
  avatar: text("avatar"),
  username: text("username").unique(),
  emailVerified: integer("email_verified", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
  deleted: integer("deleted", { mode: "boolean" }).notNull().default(false),
  lastModifiedVersion: integer("version").notNull().default(1),
});

export const accounts = sqliteTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable("sessions", {
  sessionToken: text("session_token").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verification_tokens",
  {
    identifier: text("id").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const replicacheServer = sqliteTable("replicache_server", {
  id: text("id").notNull().primaryKey().default("1234"),
  version: integer("version").default(1),
});

export const replicacheClient = sqliteTable("replicache_client", {
  id: text("id").notNull().primaryKey(),
  lastMutationID: integer("last_mutation_id").notNull(),
  client_group_id: text("client_group_id").notNull(),
  version: integer("version").notNull(),
});

export type UserType = typeof users.$inferSelect;
export type NewUserType = typeof users.$inferInsert;

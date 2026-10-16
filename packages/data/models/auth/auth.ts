/**
 * This module contains functions to interact with
 * the user data on server side.
 *
 * Used by server adapters with an explicit D1 binding
 */

import { eq, inArray } from "drizzle-orm";

import { users } from "../../schemas/auth.schema";
import type { UserType } from "../../schemas/auth.schema";
import type { DataDb } from "../../lib/create-db";

/**
 * Get user by userId
 */
export function createUserModel(createDb: () => DataDb) {
  async function getUserById(id?: string) {
    try {
      const db = createDb();

      const user = await db.query.users.findFirst({
        where: eq(users.id, id || ""),
      });

      return user;
    } catch (e) {
      return null;
    }
  }

  async function getUserByUsername(username: string) {
    try {
      const db = createDb();

      const user = await db.query.users.findFirst({
        columns: { id: false },
        where: eq(users.username, username),
      });

      return user;
    } catch (e) {
      return null;
    }
  }

  /**
   * Update user (displayName, avatar, username or all of them)
   * for corresponding user with @param userId
   */
  async function updateUserById(userId: string, data: Partial<UserType>) {
    try {
      const db = createDb();

      const [user, updated] = await db.batch([
        db.query.users.findFirst({ where: eq(users.id, userId) }),
        db.update(users).set(data).where(eq(users.id, userId)).returning(),
      ]);

      return { user, updatedUser: updated[0] };
    } catch (e) {
      if (!(e instanceof Error)) return { error: "Internal server error" };

      switch (e.message) {
        case "D1_ERROR: UNIQUE constraint failed: users.username":
          return { error: "Dup username" };
        default:
          return { error: "Failed to update user" };
      }
    }
  }

  async function getUserInfoById(userIds: string[]) {
    try {
      const db = createDb();

      const user = await db.query.users.findMany({
        columns: {
          updatedAt: false,
          createdAt: false,
        },
        where: inArray(users.id, userIds),
      });

      return user;
    } catch (e) {
      return null;
    }
  }

  return { getUserById, getUserByUsername, updateUserById, getUserInfoById };
}

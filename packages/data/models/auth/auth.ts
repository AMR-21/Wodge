/**
 * This module contains functions to interact with
 * the user data on server side.
 *
 * Used in server actions only
 */

"use server";
import "server-only";

import { eq, inArray } from "drizzle-orm";

import { users } from "../../schemas/auth.schema";
import { UserType } from "../..";
import { createDb } from "../../server";

/**
 * Get user by userId
 */
export async function getUserById(id?: string) {
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

export async function getUserByUsername(username: string) {
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
export async function updateUserById(userId: string, data: Partial<UserType>) {
  try {
    const db = createDb();

    const [user, updated] = await db.batch([
      db.query.users.findFirst({ where: eq(users.id, userId) }),
      db.update(users).set(data).where(eq(users.id, userId)).returning(),
    ]);

    return { user, updatedUser: updated[0] };
  } catch (e) {
    console.log(e);
    if (!(e instanceof Error)) return { error: "Internal server error" };

    switch (e.message) {
      case "D1_ERROR: UNIQUE constraint failed: users.username":
        return { error: "Username already exists" };
      default:
        return { error: "Failed to update user" };
    }
  }
}

export async function getUserInfoById(userIds: string[]) {
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

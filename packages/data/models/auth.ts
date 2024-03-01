/**
 * This module contains functions to interact with
 * the user data on server side.
 *
 * Used in server actions only
 */

"use server";
import "server-only";

import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { users } from "../schemas/auth.schema";
import { UserType } from "..";

/**
 * Get user by userId
 */
export async function getUserById(id: string) {
  try {
    const user = await db.query.users.findFirst({
      columns: { emailVerified: false },
      where: eq(users.id, id),
    });

    return user as UserType;
  } catch (e) {
    return null;
  }
}

export async function getUserByUsername(username: string) {
  try {
    const user = await db.query.users.findFirst({
      columns: { id: false, emailVerified: false, updatedAt: false },
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
    const user = await db
      .update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning();

    return { user: user[0] as UserType };
  } catch (e) {
    if (!(e instanceof Error)) return { error: "Internal server error" };

    switch (e.message) {
      case "D1_ERROR: UNIQUE constraint failed: users.username":
        return { error: "Username already exists" };
      default:
        return { error: "Failed to update user" };
    }
  }
}

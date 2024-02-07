"use server";
import "server-only";

import { eq } from "drizzle-orm";
import { NewProfile, Profile, profiles } from "../schemas/db.schema";
import { z } from "zod";
import { db, users } from "..";

/**
 * Get profile by userId
 */
export async function getProfileById(id: string): Promise<Partial<Profile>> {
  try {
    const profile = await db.query.profiles.findFirst({
      columns: { userId: false },
      where: eq(profiles.userId, id),
    });

    return profile;
  } catch (e) {
    return null;
  }
}

export async function getProfileByUsername(username: string) {
  try {
    const profile = await db.query.profiles.findFirst({
      columns: { username: true },
      where: eq(profiles.username, username),
    });

    return profile;
  } catch (e) {
    return null;
  }
}

/**
 * Update profile (displayName, avatar, username or all of them)
 * for corresponding profile with @param userId
 * @param withFlag indicate whether to update the hasProfile flag
 * for a user with @param userId - i.e. A profile for new user.
 */
export async function updateProfileById(
  userId: string,
  data: Partial<NewProfile>,
  withFlag = false
) {
  try {
    if (withFlag) {
      const [profilesArr, usersArr] = await db.batch([
        db
          .update(profiles)
          .set(data)
          .where(eq(profiles.userId, userId))
          .returning(),
        db
          .update(users)
          .set({ hasProfile: true })
          .where(eq(users.id, userId))
          .returning(),
      ]);

      return profilesArr[0];
    }

    const profile = await db
      .update(profiles)
      .set(data)
      .where(eq(profiles.userId, userId))
      .returning();

    return profile;
  } catch {
    return null;
  }
}

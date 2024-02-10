"use server";
import "server-only";

import { z } from "zod";
import { redirect } from "next/navigation";

import { currentUser } from "@/lib/server-utils";
import {
  UpdateProfileSchema,
  db,
  getProfileByUsername,
  updateProfileById,
} from "@repo/data";

export async function updateProfile(
  rawData: z.infer<typeof UpdateProfileSchema>,
) {
  // 1. Authenticate access
  const user = await currentUser();

  if (!user) {
    return redirect("/login");
  }

  // 2. Validate data
  const validatedFields = UpdateProfileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: "Invalid data" };
  }

  const { data } = validatedFields;

  // TODO
  // 3. Check if there is a new profile avatar

  // 4. Verify that the username is unique and update profile
  if (data.username) {
    const profile = await getProfileByUsername(data.username);

    if (profile) {
      return { error: "Username already exists" };
    }
  }

  // 5. Check if a new user then update profile
  const updatedProfile = await updateProfileById(
    user.id,
    {
      ...data,
      updatedAt: new Date(),
    },
    !user.hasProfile,
  );

  if (updatedProfile) return { success: true, profile: updatedProfile };

  return { error: "Failed to update profile" };
}

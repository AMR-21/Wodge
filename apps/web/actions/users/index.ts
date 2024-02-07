"use server";
import "server-only";

import { z } from "zod";
import { redirect } from "next/navigation";

import { currentUser } from "@/lib/server-utils";
import {
  ProfileSchema,
  getProfileByUsername,
  updateProfileById,
} from "@repo/data";

export async function updateProfile(data: z.infer<typeof ProfileSchema>) {
  // 1. Authenticate access
  const user = await currentUser();

  if (!user) {
    return redirect("/login");
  }

  // 2. Validate data
  const validatedFields = ProfileSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid data" };
  }

  // 3. Verify that the username is unique
  if (data.username) {
    const profile = await getProfileByUsername(data.username);

    if (profile) {
      return { error: "Username already exists" };
    }
  }

  // 4. Check if a new user then update profile
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

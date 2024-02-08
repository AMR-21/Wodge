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
import { writeFile } from "fs/promises";

export async function updateProfile(formData: FormData) {
  // 1. Authenticate access
  const user = await currentUser();

  if (!user) {
    return redirect("/login");
  }

  const rawData = {
    displayName: formData.get("displayName"),
    username: formData.get("username"),
    avatar: formData.get("avatar"),
    avatarFile: formData.get("avatarFile"),
  };

  // 2. Validate data
  const validatedFields = ProfileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: "Invalid data" };
  }

  const { avatarFile, ...data } = validatedFields.data;

  // 3. Verify that the username is unique
  if (data.username) {
    const profile = await getProfileByUsername(data.username);

    if (profile) {
      return { error: "Username already exists" };
    }
  }

  // 4. Check if there is a new profile avatar
  // and remover the default avatar
  if (avatarFile) {
    // TODO: Save the file to R2
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

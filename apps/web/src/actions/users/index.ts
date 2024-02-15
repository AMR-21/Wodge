"use server";
import "server-only";

import { z } from "zod";
import { redirect } from "next/navigation";

import { currentUser } from "@/lib/server-utils";
import { UserPublicInfoSchema } from "@repo/data/schemas";
import { updateUserById } from "@repo/data/server-models";

export async function updateProfile(
  rawData: z.infer<typeof UserPublicInfoSchema>,
) {
  // 1. Authenticate access
  const user = await currentUser();

  if (!user) {
    return redirect("/login");
  }

  // 2. Validate data
  const validatedFields = UserPublicInfoSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: "Invalid data" };
  }

  const { data } = validatedFields;

  // TODO
  // 3. Check if there is a new profile avatar

  // 4. Update user data
  const res = await updateUserById(user.id, {
    ...data,
    updatedAt: new Date(),
  });

  // if (updatedUser) return { success: true, user: updatedUser };
  if (res.user) return { success: true, user: res.user };

  return res;
}

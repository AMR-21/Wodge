"use server";

import { auth } from "@/lib/auth";
import { NewWorkspace, NewWorkspaceSchema } from "@repo/data";
import "server-only";

export async function createWorkspace(data: NewWorkspace) {
  // 1. Authenticate user
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  // 2. Validate data
  const validatedFields = NewWorkspaceSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid data" };
  }

  const { data: workspaceData } = validatedFields;

  // 3. Create workspace
  // await db.
}

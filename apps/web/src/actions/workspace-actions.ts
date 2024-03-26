"use server";

import { auth } from "@/lib/auth";
import {
  NewWorkspace,
  NewWorkspaceSchema,
  Workspace,
  workspaces,
  WorkspaceSchema,
} from "@repo/data";
import { db } from "@repo/data/server";
import { eq } from "drizzle-orm";
import "server-only";

// Todo move it to DO when the bindings are supported
export async function updateWorkspace(
  workspaceId: string,
  data: Pick<Workspace, "name" | "slug">,
) {
  // 1. Authenticate user
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  // TODO authorize action

  // 2. Validate data
  const validatedFields = WorkspaceSchema.pick({
    name: true,
    slug: true,
  }).safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid data" };
  }

  const { data: updatedData } = validatedFields;

  // 3. update workspace
  await db
    .update(workspaces)
    .set(updatedData)
    .where(eq(workspaces.id, workspaceId));
}

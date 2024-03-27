"use server";
import "server-only";

import {
  memberships,
  Workspace,
  workspaces,
} from "../../schemas/workspace.schema";
import { db } from "../../server";
import { eq } from "drizzle-orm";

/**
 * DB operations on a workspace
 */
export async function createWorkspace(data: Workspace) {
  try {
    const [workspace] = await db.batch([
      db.insert(workspaces).values(data).returning(),
      db
        .insert(memberships)
        .values({ workspaceId: data.id!, userId: data.owner }),
    ]);

    return { workspace: workspace[0] };
  } catch (e) {
    if (!(e instanceof Error)) return { error: "Internal server error" };

    console.log(e);
    switch (e.message) {
      case "D1_ERROR: UNIQUE constraint failed: workspaces.slug":
        return { error: "Workspace slug already exists" };
      default:
        return { error: "Failed to create workspace" };
    }
  }
}

export async function getWorkspacesByUserId(userId: string) {
  return await db
    .select()
    .from(memberships)
    .where(eq(memberships.userId, userId))
    .innerJoin(workspaces, eq(workspaces.id, memberships.workspaceId));
}

export async function updateWorkspaceById(
  workspaceId: string,
  data: Pick<Workspace, "name" | "slug">
) {
  return await db
    .update(workspaces)
    .set(data)
    .where(eq(workspaces.id, workspaceId));
}

export async function addWorkspaceMember(userId: string, workspaceId: string) {
  return await db.insert(memberships).values({ userId, workspaceId });
}

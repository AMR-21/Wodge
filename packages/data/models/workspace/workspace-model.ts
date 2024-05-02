"use server";
import "server-only";

import {
  memberships,
  Workspace,
  workspaces,
} from "../../schemas/workspace.schema";
// import { db } from "../../server";
import { and, eq } from "drizzle-orm";
import { createDb } from "../../server";

/**
 * DB operations on a workspace
 */
export async function createWorkspace(data: Workspace) {
  try {
    const db = createDb();

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
  const db = createDb();

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
  const db = createDb();
  return await db
    .update(workspaces)
    .set(data)
    .where(eq(workspaces.id, workspaceId));
}

export async function addWorkspaceMember(userId: string, workspaceId: string) {
  const db = createDb();
  await db.insert(memberships).values({ userId, workspaceId });
  return await db.query.workspaces.findFirst({
    where: eq(workspaces.id, workspaceId),
  });
}

export async function removeMember(userId: string, workspaceId: string) {
  const db = createDb();
  return await db
    .delete(memberships)
    .where(
      and(
        eq(memberships.userId, userId),
        eq(memberships.workspaceId, workspaceId)
      )
    );
}

export async function deleteWorkspace(workspaceId: string) {
  const db = createDb();
  return await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
}

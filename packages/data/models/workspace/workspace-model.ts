"use server";
import "server-only";

import {
  invites,
  memberships,
  Workspace,
  workspaces,
} from "../../schemas/workspace.schema";
// import { db } from "../../server";
import { and, eq } from "drizzle-orm";
import { createDb } from "../../server";
import { nanoid } from "nanoid";

/**
 * DB operations on a workspace
 */
export async function createWorkspace(data: Workspace) {
  try {
    // Validate ws data
    const db = createDb();

    console.log(data);

    const [workspace] = await db.batch([
      db.insert(workspaces).values(data).returning(),
      db
        .insert(memberships)
        .values({ workspaceId: data.id!, userId: data.owner }),
      db.insert(invites).values({
        workspaceId: data.id!,
        createdBy: data.owner,
        token: nanoid(8),
      }),
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
  data: {
    name?: Workspace["name"];
    slug?: Workspace["slug"];
    avatar?: Workspace["avatar"];
  }
) {
  const db = createDb();

  const [wrk] = await db.batch([
    db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
    }),
    db.update(workspaces).set(data).where(eq(workspaces.id, workspaceId)),
  ]);
  return wrk;
}

export async function addWorkspaceMember(
  userId: string,
  workspaceId: string,
  token: string
) {
  const db = createDb();

  try {
    const data = await db
      .select()
      .from(invites)
      .innerJoin(workspaces, eq(workspaces.id, invites.workspaceId))
      .where(eq(invites.token, token))
      .get();

    if (
      !data ||
      data.invites.workspaceId !== workspaceId ||
      !data.workspaces.isInviteLinkEnabled
    )
      return null;

    await db.insert(memberships).values({ userId, workspaceId });

    return data.invites;
  } catch {
    return null;
  }
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

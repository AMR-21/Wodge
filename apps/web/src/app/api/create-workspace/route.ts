import { sign } from "@/lib/utils/sign";
import { Workspace, workspaces, WorkspaceSchema } from "@repo/data";
import { createDb, createWorkspace } from "@repo/data/server";
import { env } from "@repo/env";
import { eq } from "drizzle-orm";

import * as jose from "jose";

export async function POST(req: Request) {
  const rawWorkspace = (await req.json()) as Workspace;
  const userId = req.headers.get("x-user-id");

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const validatedFields = WorkspaceSchema.safeParse({
    ...rawWorkspace,
    owner: userId,
    createdAt: new Date(),
  });

  if (!validatedFields.success)
    return new Response("Invalid workspace data", { status: 401 });

  const { data: newWorkspace } = validatedFields;

  // Create workspace
  const { error } = await createWorkspace(newWorkspace as Workspace);

  if (error) return new Response(error, { status: 400 });

  const jwt = await sign({ userId });

  // Init DO
  const createRes = await fetch(
    `${env.BACKEND_DOMAIN}/parties/workspace/${newWorkspace.id}/create?token=${jwt}`,
    {
      method: "POST",
      headers: {
        authorization: jwt,
        "x-user-id": userId,
      },
    },
  );

  if (!createRes.ok) {
    console.log("fail");
    const db = createDb();

    // await db
    //   .delete(workspaces)
    //   .where(eq(workspaces.id, newWorkspace.id as string));
    return new Response("Failed to create workspace", { status: 400 });
  }

  return Response.json({ workspace: newWorkspace }, { status: 201 });
}

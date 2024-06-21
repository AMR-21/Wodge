import { sign } from "@/lib/utils/sign";
import { memberships, Workspace } from "@repo/data";
import {
  addWorkspaceMember,
  createDb,
  updateWorkspaceById,
} from "@repo/data/server";
import { env } from "@repo/env";
import { and, eq } from "drizzle-orm";

export async function POST(
  req: Request,
  {
    params: { token, workspaceId },
  }: { params: { workspaceId: string; token: string } },
) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return new Response(null, { status: 401 });
  }

  const invite = await addWorkspaceMember(userId, workspaceId, token);

  if (!invite) return new Response(null, { status: 400 });

  // Update the DO
  const authToken = await sign({ userId });

  const res = await fetch(
    `${env.BACKEND_DOMAIN}/parties/workspace/${invite.workspaceId}/join?token=${authToken}`,
    {
      method: "POST",

      body: JSON.stringify({ invite }),
    },
  );

  if (!res.ok) {
    console.log("no");
    const db = createDb();

    await db
      .delete(memberships)
      .where(
        and(
          eq(memberships.userId, userId),
          eq(memberships.workspaceId, workspaceId),
        ),
      );

    return new Response(null, { status: 400 });
  }

  return Response.json({ invite });
}

import { Workspace } from "@repo/data";
import { addWorkspaceMember, updateWorkspaceById } from "@repo/data/server";
import { env } from "@repo/env";

export async function POST(req: Request) {
  const serviceKey = req.headers.get("authorization");

  if (env.SERVICE_KEY !== serviceKey)
    return new Response(null, { status: 401 });

  const workspaceId = req.headers.get("workspaceId");

  const userId = req.headers.get("userId");

  const token = req.headers.get("token");

  if (!userId || !workspaceId || !token) {
    return new Response(null, { status: 401 });
  }

  const invite = await addWorkspaceMember(userId, workspaceId, token);

  if (!invite) return new Response(null, { status: 400 });

  return Response.json({ invite });
}

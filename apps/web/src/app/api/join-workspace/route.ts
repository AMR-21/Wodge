import { Workspace } from "@repo/data";
import { addWorkspaceMember, updateWorkspaceById } from "@repo/data/server";
import { env } from "@repo/env";

export async function POST(req: Request) {
  const serviceKey = req.headers.get("authorization");

  if (env.SERVICE_KEY !== serviceKey)
    return new Response(null, { status: 401 });

  const workspaceId = req.headers.get("workspaceId");

  const userId = req.headers.get("userId");

  console.log("workspaceId", workspaceId);

  if (!userId || !workspaceId) {
    return new Response(null, { status: 401 });
  }

  await addWorkspaceMember(userId, workspaceId);

  return new Response(null, { status: 200 });
}

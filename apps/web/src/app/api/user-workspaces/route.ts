import { getWorkspacesByUserId } from "@repo/data/server";
import { env } from "@repo/env";

export async function GET(req: Request) {
  const serviceKey = req.headers.get("authorization");

  if (env.SERVICE_KEY !== serviceKey)
    return new Response(null, { status: 401 });

  const userId = req.headers.get("x-user-id");

  if (!userId) return new Response(null, { status: 401 });

  const res = await getWorkspacesByUserId(userId);

  const workspaces = res.map((r) => r.workspaces);

  return Response.json(workspaces, { status: 200 });
}

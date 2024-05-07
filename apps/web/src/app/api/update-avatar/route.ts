import { getAvatarAddress, makeWorkspaceAvatarKey } from "@repo/data";
import { updateWorkspaceById } from "@repo/data/server";
import { env } from "@repo/env";

export async function POST(req: Request) {
  const serviceKey = req.headers.get("authorization");

  if (env.SERVICE_KEY !== serviceKey)
    return new Response(null, { status: 401 });

  const workspaceId = req.headers.get("workspaceId");
  const key = req.headers.get("key");

  if (!workspaceId || !key) {
    return new Response(null, { status: 400 });
  }

  await updateWorkspaceById(workspaceId, {
    avatar: getAvatarAddress(makeWorkspaceAvatarKey(key)),
  });

  return new Response(null, { status: 200 });
}

export async function DELETE(req: Request) {
  const serviceKey = req.headers.get("authorization");

  if (env.SERVICE_KEY !== serviceKey)
    return new Response(null, { status: 401 });

  const workspaceId = req.headers.get("workspaceId");

  if (!workspaceId) {
    return new Response(null, { status: 400 });
  }

  const wrk = await updateWorkspaceById(workspaceId, {
    avatar: null,
  });

  return Response.json({ workspace: wrk });
}

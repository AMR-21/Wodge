import { getAvatarAddress, makeWorkspaceAvatarKey } from "@repo/data";
import { updateWorkspaceById } from "@repo/data/server";
import { env } from "@repo/env";

export async function POST(req: Request) {
  const serviceKey = req.headers.get("authorization");

  if (env.SERVICE_KEY !== serviceKey)
    return new Response(null, { status: 401 });

  const workspaceId = req.headers.get("workspaceId");

  if (!workspaceId) {
    return new Response(null, { status: 400 });
  }

  await updateWorkspaceById(workspaceId, {
    avatar: getAvatarAddress(makeWorkspaceAvatarKey(workspaceId)),
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

  await updateWorkspaceById(workspaceId, {
    avatar: null,
  });

  return new Response(null, { status: 200 });
}

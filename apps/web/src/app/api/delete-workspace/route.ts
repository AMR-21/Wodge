// This temporary as partykit does not support bindings yet

import { deleteWorkspace, removeMember } from "@repo/data/server";
import { env } from "@repo/env";

export async function POST(req: Request) {
  const serviceKey = req.headers.get("authorization");

  if (env.SERVICE_KEY !== serviceKey)
    return new Response(null, { status: 401 });

  const { workspaceId } = (await req.json()) as {
    workspaceId: string;
  };

  if (!workspaceId) return new Response(null, { status: 400 });

  await deleteWorkspace(workspaceId);

  return new Response(null, { status: 204 });
}

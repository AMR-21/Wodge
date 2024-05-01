// This temporary as partykit does not support bindings yet

import { removeMember } from "@repo/data/server";
import { env } from "@repo/env";

export async function POST(req: Request) {
  const serviceKey = req.headers.get("authorization");

  if (env.SERVICE_KEY !== serviceKey)
    return new Response(null, { status: 401 });

  const { memberId, workspaceId } = (await req.json()) as {
    memberId: string;
    workspaceId: string;
  };

  if (!memberId || !workspaceId) return new Response(null, { status: 400 });

  await removeMember(memberId, workspaceId);

  return new Response(null, { status: 200 });
}

// This temporary as partykit does not support bindings yet

import { sign } from "@/lib/utils/sign";
import { removeMember } from "@repo/data/server";
import { env } from "@repo/env";

export async function POST(
  req: Request,
  {
    params: { workspaceId, memberId },
  }: { params: { workspaceId: string; memberId: string } },
) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return new Response(null, { status: 400 });
  }

  const token = await sign({ userId });

  const authRes = await fetch(
    `${env.BACKEND_DOMAIN}/parties/workspace/${workspaceId}/service/isAdmin?token=${token}`,
    { headers: { authorization: env.SERVICE_KEY as string } },
  );

  if (!authRes.ok) return new Response(null, { status: 401 });

  if (!memberId || !workspaceId) return new Response(null, { status: 400 });

  await removeMember(memberId, workspaceId);

  return new Response(null, { status: 200 });
}

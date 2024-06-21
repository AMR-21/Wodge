// This temporary as partykit does not support bindings yet

import { deleteWorkspace, removeMember } from "@repo/data/server";
import { env } from "@repo/env";
import { sign } from "../../../../lib/utils/sign";

export async function POST(
  req: Request,
  { params: { workspaceId } }: { params: { workspaceId: string } },
) {
  const userId = req.headers.get("x-user-id");

  if (!userId) return new Response(null, { status: 401 });
  const token = await sign({ userId });

  const authRes = await fetch(
    `${env.BACKEND_DOMAIN}/parties/workspace/${workspaceId}/service/isAdmin?token=${token}`,
    { headers: { authorization: env.SERVICE_KEY as string } },
  );

  if (!authRes.ok) return new Response(null, { status: 401 });

  await deleteWorkspace(workspaceId);

  // inform DO
  const res = await fetch(
    `${env.BACKEND_DOMAIN}/parties/workspace/${workspaceId}?token=${token}`,
    {
      method: "DELETE",
    },
  );

  if (!res.ok) return new Response(null, { status: 500 });

  return new Response(null, { status: 204 });
}

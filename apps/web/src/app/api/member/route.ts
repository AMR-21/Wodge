// This temporary as partykit does not support bindings yet

import { getUserInfoById } from "@repo/data/server";
import { env } from "@repo/env";

export async function POST(req: Request) {
  const serviceKey = req.headers.get("authorization");

  if (env.SERVICE_KEY !== serviceKey)
    return new Response(null, { status: 401 });

  const { membersIds } = (await req.json()) as { membersIds: string[] };

  const members = await getUserInfoById(membersIds);

  if (!members) return new Response(null, { status: 404 });

  return Response.json(members);
}

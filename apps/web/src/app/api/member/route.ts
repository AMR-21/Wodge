// This temporary as partykit does not support bindings yet

import { getUserInfoById } from "@repo/data/server";
import { env } from "@repo/env";

export async function POST(req: Request) {
  const serviceKey = req.headers.get("authorization");

  if (env.SERVICE_KEY !== serviceKey)
    return new Response(null, { status: 401 });

  const { memberId } = (await req.json()) as { memberId: string };

  if (typeof memberId !== "string") return new Response(null, { status: 400 });

  const member = await getUserInfoById(memberId);

  if (!member) return new Response(null, { status: 404 });

  return Response.json(member);
}

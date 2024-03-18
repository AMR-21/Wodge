import type * as Party from "partykit/server";

import WorkspaceParty from "../workspace-party";
import { error, json, notFound, ok } from "../../lib/http-utils";

export async function getMemberInfo(req: Party.Request, party: WorkspaceParty) {
  const { memberId } = (await req.json()) as { memberId: string };

  if (typeof memberId !== "string") return new Response(null, { status: 400 });

  const memberExists = party.workspaceMembers.data.members.some(
    (m) => m.id === memberId
  );

  if (!memberExists) return notFound();

  const res = await fetch(`${party.room.env.AUTH_DOMAIN}/api/member`, {
    method: "POST",
    headers: {
      Authorization: party.room.env.SERVICE_KEY as string,
    },
    body: JSON.stringify({ memberId }),
  });

  if (!res.ok) return error("Failed to fetch user info");

  const member = await res.json();

  return json(member);
}

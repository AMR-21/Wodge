import { Context } from "hono";
import WorkspaceParty from "../workspace-party";
import { badRequest, ok } from "@/lib/http-utils";

export async function getInvites(party: WorkspaceParty, c: Context) {
  const res = await fetch(`${party.room.env.AUTH_DOMAIN}/api/get-invites`, {
    headers: {
      workspaceId: party.room.id,
      authorization: party.room.env.SERVICE_KEY as string,
    },
  });

  if (res.ok) {
    const data = await res.json();

    return c.json(data);
  }

  return badRequest();
}

import { Context } from "hono";
import WorkspaceParty from "../workspace-party";
import { badRequest } from "@/lib/http-utils";

export async function createInviteLink(party: WorkspaceParty, c: Context) {
  const userId = c.req.header("x-user-id")!;

  const res = await fetch(
    `${party.room.env.APP_DOMAIN}/api/create-invite-link`,
    {
      method: "POST",
      headers: {
        workspaceId: party.room.id,
        authorization: party.room.env.SERVICE_KEY as string,
        userId,
      },
    }
  );

  if (res.ok) {
    const data = await res.json();
    return c.json(data);
  }

  return badRequest();
}

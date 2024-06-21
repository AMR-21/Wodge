import { Context } from "hono";
import WorkspaceParty from "../workspace-party";
import { badRequest, ok } from "@/lib/http-utils";

export async function toggleInviteLink(party: WorkspaceParty, c: Context) {
  const res = await fetch(
    `${party.room.env.AUTH_DOMAIN}/api/toggle-invite-link`,
    {
      method: "PATCH",
      headers: {
        workspaceId: party.room.id,
        authorization: party.room.env.SERVICE_KEY as string,
      },
    }
  );

  if (res.ok) {
    return ok();
  }

  return badRequest();
}

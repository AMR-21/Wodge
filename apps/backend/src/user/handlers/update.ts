import { Context } from "hono";
import UserParty from "../user-party";
import { ok, unauthorized } from "../../lib/http-utils";

export async function update(party: UserParty, c: Context) {
  const serviceKey = c.req.header("authorization");

  if (serviceKey !== party.room.env.SERVICE_KEY) {
    return unauthorized();
  }

  const workspaceParty = party.room.context.parties.workspace!;

  const req = [...party.workspacesStore].map((wid) => {
    return workspaceParty.get(wid).fetch("/member-update", {
      method: "POST",
      headers: {
        Authorization: party.room.env.SERVICE_KEY as string,
      },
    });
  });

  await Promise.all(req);

  return ok();
}

import { Context } from "hono";
import WorkspaceParty from "../workspace-party";
import { badRequest, ok } from "../../lib/http-utils";

export async function channelPoke(party: WorkspaceParty, c: Context) {
  const channelId = c.req.header("channelId");
  if (!channelId) {
    return badRequest();
  }

  await party.poke({
    type: "channel",
    id: channelId,
  });

  return ok();
}

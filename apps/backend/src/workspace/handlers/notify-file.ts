import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { badRequest, ok, unauthorized } from "../../lib/http-utils";

export async function notifyFile(req: Party.Request, party: WorkspaceParty) {
  const teamId = req.headers.get("x-team-id");
  const serviceKey = req.headers.get("Authorization");

  if (serviceKey !== party.room.env.SERVICE_KEY) {
    return unauthorized();
  }

  if (!teamId) return ok();

  await party.poke({
    type: "team-files",
    id: teamId,
  });

  return ok();
}

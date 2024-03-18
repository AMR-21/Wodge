import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { isAllowed } from "../../lib/utils";
import { json, unauthorized } from "../../lib/http-utils";

export async function getInvites(req: Party.Request, party: WorkspaceParty) {
  // if (!isAllowed(req, party, ["admin"])) return unauthorized();

  return json({
    ...Object.fromEntries(party.invites),
  });
}

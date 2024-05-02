import WorkspaceParty from "../workspace-party";
import { json } from "../../lib/http-utils";
import { Context } from "hono";

export async function getInvites(party: WorkspaceParty, c: Context) {
  return json({
    ...Object.fromEntries(party.invites),
  });
}

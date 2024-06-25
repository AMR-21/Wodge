import { Context } from "hono";
import WorkspaceParty from "../workspace-party";
import { ok, unauthorized } from "../../lib/http-utils";

export async function isAdmin(party: WorkspaceParty, c: Context) {
  const userId = c.req.header("x-user-id");

  if (
    party.workspaceMembers.data.createdBy === userId ||
    party.workspaceMembers.data.members.some((member) => member.id === userId)
  ) {
    return ok();
  }

  return unauthorized();
}

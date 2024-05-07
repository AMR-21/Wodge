import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { json } from "../../lib/http-utils";
import { Context } from "hono";

export function getMembership(party: WorkspaceParty, c: Context) {
  const userId = c.req.header("x-user-id");

  if (!userId)
    return json({
      success: false,
    });

  if (party.workspaceMembers.data.createdBy === userId)
    return json({
      success: true,
    });

  if (
    party.workspaceMembers.data.members.some((member) => member.id === userId)
  )
    return json({
      success: true,
    });

  return json({
    success: false,
  });
}

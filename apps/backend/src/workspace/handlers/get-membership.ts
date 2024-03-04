import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { json } from "../../lib/http-utils";

export function getMembership(req: Party.Request, party: WorkspaceParty) {
  const serviceKey = req.headers.get("authorization");
  const userId = req.headers.get("x-user-id");

  // Verify service key
  if (serviceKey !== party.room.env.SERVICE_KEY)
    return json({
      success: false,
    });

  if (!userId)
    return json({
      success: false,
    });

  if (party.workspaceMembers.data.owner === userId)
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

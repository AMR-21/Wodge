import { Context, Next } from "hono";
import { isAdmin, isOwner } from "@repo/data";
import WorkspaceParty from "../workspace-party";
import { unauthorized } from "../../lib/http-utils";

export async function adminMiddleware(
  party: WorkspaceParty,
  c: Context,
  next: Next
) {
  const userId = c.req.header("x-user-id");

  if (
    !isOwner({
      members: party.workspaceMembers.data,
      userId,
    }) &&
    !isAdmin({
      members: party.workspaceMembers.data,
      userId,
    })
  ) {
    return unauthorized();
  }

  return await next();
}

import { Context, Next } from "hono";
import { unauthorized } from "../../lib/http-utils";
import WorkspaceParty from "../workspace-party";

export async function serviceMiddleware(
  party: WorkspaceParty,
  c: Context,
  next: Next
) {
  const serviceKey = c.req.header("authorization");

  // Verify service key
  if (serviceKey !== party.room.env.SERVICE_KEY) return unauthorized();

  return await next();
}

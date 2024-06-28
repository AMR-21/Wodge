import { Context, Next } from "hono";
import * as Party from "partykit/server";
import { unauthorized } from "./http-utils";

export async function serviceMiddleware(
  room: Party.Room,
  c: Context,
  next: Next
) {
  const serviceKey = c.req.header("authorization");

  // Verify service key
  if (serviceKey !== room.env.SECRET_KEY) return unauthorized();

  return await next();
}

import { Context, Next } from "hono";
import * as Party from "partykit/server";
import { unauthorized } from "./http-utils";

export async function serviceMiddleware(
  room: Party.Room,
  c: Context,
  next: Next
) {
  const secretKey = c.req.header("authorization");

  // Verify service key
  if (secretKey !== room.env.SECRET_KEY) return unauthorized();

  return await next();
}

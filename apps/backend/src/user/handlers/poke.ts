import type * as Party from "partykit/server";
import UserParty from "../user-party";
import { ok, unauthorized } from "../../lib/http-utils";
import { PokeMessage } from "@repo/data";
import { Context } from "hono";

export async function poke(party: UserParty, c: Context) {
  const serviceKey = c.req.header("authorization");

  if (serviceKey !== party.room.env.SERVICE_KEY) {
    return unauthorized();
  }

  const body = <PokeMessage>await c.req.json();

  party.poke(body);

  return ok();
}

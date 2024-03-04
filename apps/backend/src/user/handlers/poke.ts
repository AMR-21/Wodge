import type * as Party from "partykit/server";
import UserParty from "../user-party";
import { ok, unauthorized } from "../../lib/http-utils";

export async function poke(req: Party.Request, party: UserParty) {
  const serviceKey = req.headers.get("authorization");

  if (serviceKey !== party.room.env.serviceKey) {
    return unauthorized();
  }

  const body = <{}>await req.json();

  party.poke(body);

  return ok();
}

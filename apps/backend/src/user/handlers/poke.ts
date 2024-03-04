import type * as Party from "partykit/server";
import UserParty from "../user-party";
import { ok, unauthorized } from "../../lib/http-utils";
import { PokeMessage } from "@repo/data";

export async function poke(req: Party.Request, party: UserParty) {
  const serviceKey = req.headers.get("authorization");

  if (serviceKey !== party.room.env.SERVICE_KEY) {
    return unauthorized();
  }

  const body = <PokeMessage>await req.json();

  party.poke(body);

  return ok();
}

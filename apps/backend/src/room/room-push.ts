import type * as Party from "partykit/server";
import { repPush, RunnerParams } from "../lib/replicache";
import RoomParty from "./room-party";
import { pokeWorkspace } from "../lib/utils";
import { badRequest } from "../lib/http-utils";

export async function roomPush(req: Party.Request, party: RoomParty) {
  const wid = req.headers.get("x-workspace-id");

  if (!wid) return badRequest();

  const res = await repPush({
    req,
    storage: party.room.storage,
    versions: party.versions,
    runner: runner(party, req),
  });

  if (res.status === 200) {
    await pokeWorkspace(wid, party);
  }

  return res;
}

//verify room id
function runner(party: RoomParty, req: Party.Request) {
  return async (params: RunnerParams) => {
    switch (params.mutation.name) {
      default:
        throw new Error("Unknown mutation: " + params.mutation.name);
    }
  };
}

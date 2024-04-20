import type * as Party from "partykit/server";
import { repPush, RunnerParams } from "../lib/replicache";
import { pokeWorkspace } from "../lib/utils";
import { badRequest } from "../lib/http-utils";
import ThreadParty from "./thread-party";
import { createThreadMessage } from "./create-thread-message";

export async function threadPush(req: Party.Request, party: ThreadParty) {
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
function runner(party: ThreadParty, req: Party.Request) {
  return async (params: RunnerParams) => {
    switch (params.mutation.name) {
      case "createThreadMessage":
        return await createThreadMessage(party, params);

      default:
        throw new Error("Unknown mutation: " + params.mutation.name);
    }
  };
}

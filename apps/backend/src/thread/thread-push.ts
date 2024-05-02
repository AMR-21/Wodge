import type * as Party from "partykit/server";
import { repPush, RunnerParams } from "../lib/replicache";
import { pokeWorkspace } from "../lib/utils";
import { badRequest } from "../lib/http-utils";
import ThreadParty from "./thread-party";
import { createThreadMessage } from "./create-thread-message";
import { Context, HonoRequest } from "hono";

export async function threadPush(party: ThreadParty, c: Context) {
  const wid = c.req.header("x-workspace-id");

  if (!wid) return badRequest();

  const res = await repPush({
    req: c.req,
    storage: party.room.storage,
    versions: party.versions,
    runner: runner(party, c.req),
  });

  if (res.status === 200) {
    await pokeWorkspace(wid, party);
  }

  return res;
}

//verify room id
function runner(party: ThreadParty, req: HonoRequest) {
  return async (params: RunnerParams) => {
    switch (params.mutation.name) {
      case "createThreadMessage":
        return await createThreadMessage(party, params);

      default:
        throw new Error("Unknown mutation: " + params.mutation.name);
    }
  };
}

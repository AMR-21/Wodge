import type * as Party from "partykit/server";
import { repPush, RunnerParams } from "../lib/replicache";
import { pokeWorkspace } from "../lib/utils";
import { badRequest } from "../lib/http-utils";
import ThreadParty from "./thread-party";
import { createMessage } from "./create-message";
import { Context, HonoRequest } from "hono";
import { editMessage } from "./edit-message";
import { deleteMessage } from "./delete-message";

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

function runner(party: ThreadParty, req: HonoRequest) {
  const isAdmin = req.header("x-admin") === "true";
  const isOwner = req.header("x-owner") === "true";
  const isTeamModerator = req.header("x-team-moderator") === "true";

  return async (params: RunnerParams) => {
    switch (params.mutation.name) {
      case "createMessage":
        return await createMessage(party, params);
      case "editMessage":
        return await editMessage(party, params);
      case "deleteMessage":
        return await deleteMessage(
          party,
          params,
          isAdmin || isOwner || isTeamModerator
        );

      default:
        throw new Error("Unknown mutation: " + params.mutation.name);
    }
  };
}

import { repPush, RunnerParams } from "../lib/replicache";
import RoomParty from "./room-party";
import { pokeWorkspace } from "../lib/utils";
import { badRequest, unauthorized } from "../lib/http-utils";
import { sendMessage } from "./send-message";
import { AuthChannelResponse } from "../workspace/handlers/auth-channel";
import { Context, HonoRequest } from "hono";
import { deleteMessage } from "./delete-message";
import { editMessage } from "./edit-message";

export async function roomPush(party: RoomParty, c: Context) {
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
function runner(party: RoomParty, req: HonoRequest) {
  return async (params: RunnerParams) => {
    const isAdmin = req.header("x-admin") === "true";
    const isOwner = req.header("x-owner") === "true";
    const isTeamModerator = req.header("x-team-moderator") === "true";
    const canEdit = req.header("x-can-edit") === "true";

    switch (params.mutation.name) {
      case "sendMessage":
        if (!canEdit && !isAdmin && !isOwner && !isTeamModerator) return;
        return await sendMessage(party, params);
      case "deleteMessage":
        return await deleteMessage(
          party,
          params,
          isAdmin || isOwner || isTeamModerator
        );

      case "editMessage":
        return await editMessage(party, params);
      default:
        throw new Error("Unknown mutation: " + params.mutation.name);
    }
  };
}

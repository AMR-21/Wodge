import type * as Party from "partykit/server";
import { repPush, RunnerParams } from "../lib/replicache";
import RoomParty from "./room-party";
import { pokeWorkspace } from "../lib/utils";
import { badRequest, unauthorized } from "../lib/http-utils";
import { sendMessage } from "./send-message";
import { AuthChannelResponse } from "../workspace/handlers/auth-channel";

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
    const access = JSON.parse(
      req.headers.get("channel-auth")!
    ) as AuthChannelResponse;

    if (!access.success) {
      return;
    }

    if (!access.isOwner && !access.isAdmin && !access.canEdit) return;

    switch (params.mutation.name) {
      case "sendMessage":
        return await sendMessage(party, params);

      default:
        throw new Error("Unknown mutation: " + params.mutation.name);
    }
  };
}

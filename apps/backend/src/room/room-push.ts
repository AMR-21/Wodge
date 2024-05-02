import { repPush, RunnerParams } from "../lib/replicache";
import RoomParty from "./room-party";
import { pokeWorkspace } from "../lib/utils";
import { badRequest, unauthorized } from "../lib/http-utils";
import { sendMessage } from "./send-message";
import { AuthChannelResponse } from "../workspace/handlers/auth-channel";
import { Context, HonoRequest } from "hono";

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
    const access = JSON.parse(
      req.header("channel-auth")!
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

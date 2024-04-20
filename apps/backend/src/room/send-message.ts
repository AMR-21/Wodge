import { sendMessageMutation } from "@repo/data/models/room/mutators/send-msg";
import { RunnerParams } from "../lib/replicache";
import RoomParty from "./room-party";
import { Message } from "@repo/data";
import { produce } from "immer";

export async function sendMessage(party: RoomParty, params: RunnerParams) {
  const d = sendMessageMutation({
    curUserId: params.userId,
    message: params.mutation.args as Message,
    arr: party.roomMessages.data,
  });

  party.roomMessages = produce(party.roomMessages, (draft) => {
    draft.data = d;
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put("messages", party.roomMessages);
}

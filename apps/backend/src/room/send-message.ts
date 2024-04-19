import { sendMessageMutation } from "@repo/data/models/room/mutators/send-msg";
import { RunnerParams } from "../lib/replicache";
import RoomParty from "./room-party";
import { Message } from "@repo/data";

export async function sendMessage(party: RoomParty, params: RunnerParams) {
  party.roomMessages.data = sendMessageMutation({
    curUserId: params.userId,
    message: params.mutation.args as Message,
    arr: party.roomMessages.data,
  });
  console.log(party.roomMessages.data);

  party.roomMessages.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put("messages", party.roomMessages);
}

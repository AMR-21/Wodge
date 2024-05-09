import { RunnerParams } from "../lib/replicache";
import RoomParty from "./room-party";
import { Message } from "@repo/data";
import { produce } from "immer";
import { deleteMessageMutation } from "@repo/data/models/room/mutators/delete-msg";

export async function deleteMessage(
  party: RoomParty,
  params: RunnerParams,
  isPrivileged: boolean
) {
  const d = deleteMessageMutation({
    userId: params.userId,
    msg: params.mutation.args as Message,
    arr: party.roomMessages.data,
    isPrivileged,
  });

  party.roomMessages = produce(party.roomMessages, (draft) => {
    draft.data = d;
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put("messages", party.roomMessages);
}

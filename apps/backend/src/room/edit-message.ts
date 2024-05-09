import { sendMessageMutation } from "@repo/data/models/room/mutators/send-msg";
import { RunnerParams } from "../lib/replicache";
import RoomParty from "./room-party";
import { EditMessageProps, Message } from "@repo/data";
import { produce } from "immer";
import { editMessageMutation } from "@repo/data/models/room/mutators/edit-msg";

export async function editMessage(party: RoomParty, params: RunnerParams) {
  const args = params.mutation.args as EditMessageProps;
  const d = editMessageMutation({
    curUserId: params.userId,
    message: args.message,
    newContent: args.newContent,
    arr: party.roomMessages.data,
  });

  party.roomMessages = produce(party.roomMessages, (draft) => {
    draft.data = d;
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put("messages", party.roomMessages);
}

import { sendMessageMutation } from "@repo/data/models/room/mutators/send-msg";
import { RunnerParams } from "../lib/replicache";
import { Message, ThreadMessage } from "@repo/data";
import { produce } from "immer";
import ThreadParty from "./thread-party";
import { createThreadMessageMutation } from "@repo/data/models/thread/mutators/create-thread-message";

export async function createThreadMessage(
  party: ThreadParty,
  params: RunnerParams
) {
  const d = createThreadMessageMutation({
    msg: params.mutation.args as ThreadMessage,
    msgsArray: party.threadMessages.data,
    userId: params.userId,
  });

  party.threadMessages = produce(party.threadMessages, (draft) => {
    draft.data = d;
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put("messages", party.threadMessages);
}

import { RunnerParams } from "../lib/replicache";
import { ThreadMessage } from "@repo/data";
import { produce } from "immer";
import ThreadParty from "./thread-party";
import { deleteThreadMessageMutation } from "@repo/data/models/thread/mutators/delete-thread-message";

export async function deleteMessage(
  party: ThreadParty,
  params: RunnerParams,
  isPrivileged: boolean
) {
  const { msg } = params.mutation.args as { msg: ThreadMessage };

  const d = deleteThreadMessageMutation({
    msg,
    msgsArray: party.threadMessages.data,
    userId: params.userId,
    isPrivileged: msg.author === params.userId || isPrivileged,
  });

  party.threadMessages = produce(party.threadMessages, (draft) => {
    draft.data = d;
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put("messages", party.threadMessages);
}

import { RunnerParams } from "../lib/replicache";
import { EditThreadMessageArg, ThreadMessage } from "@repo/data";
import { produce } from "immer";
import ThreadParty from "./thread-party";
import { editThreadMessageMutation } from "@repo/data/models/thread/mutators/edit.thread.message";

export async function editMessage(party: ThreadParty, params: RunnerParams) {
  const { msg, newContent } = params.mutation.args as EditThreadMessageArg;

  const d = editThreadMessageMutation({
    msg,
    newContent,
    msgsArray: party.threadMessages.data,
    userId: params.userId,
  });

  party.threadMessages = produce(party.threadMessages, (draft) => {
    draft.data = d;
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put("messages", party.threadMessages);
}

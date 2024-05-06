import { produce } from "immer";
import { DrObj, ThreadMessage } from "../../..";

export function deleteThreadMessageMutation({
  msg,
  msgsArray,
  userId,
  isPrivileged,
}: {
  msg: ThreadMessage | DrObj<ThreadMessage>;
  msgsArray: ThreadMessage[] | DrObj<ThreadMessage[]>;
  userId: string;
  isPrivileged: boolean;
}) {
  //check if the current userId is the author of the message or he has the role of owner or admin in the team
  if (msg.author !== userId && !isPrivileged)
    throw new Error("You are not allowed to delete this message");
  // delete the message using produce
  const newMsgsArray = produce(msgsArray, (draft) => {
    return draft.filter((m) => m.id !== msg.id);
  });
  return newMsgsArray as ThreadMessage[];
}

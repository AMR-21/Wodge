import { produce } from "immer";
import { DrObj, ThreadMessage, ThreadMessageSchema } from "../../..";

export function createThreadMessageMutation({
  msg,
  msgsArray,
  userId,
}: {
  msg: ThreadMessage;
  msgsArray: ThreadMessage[] | DrObj<ThreadMessage[]>;
  userId: string;
}) {
  const validateFields = ThreadMessageSchema.safeParse(msg);
  if (!validateFields.success) throw new Error("Invalid msg data");

  //check the msg structure like the thread message structure if ok push the msg in the msgs array
  const { data: newMsg } = validateFields;
  if (newMsg.author !== userId) throw new Error("author error");
  //check if the message is unique in the array
  if (msgsArray.find((m) => m.id === newMsg.id))
    throw new Error("message already exists");
  const newMsgsArray = produce(msgsArray, (draft) => {
    draft.push(newMsg);
  });

  return newMsgsArray as ThreadMessage[];
}

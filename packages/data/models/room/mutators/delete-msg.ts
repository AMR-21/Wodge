import { produce } from "immer";
import { DrObj, Message, MessageSchema, WorkspaceStructure } from "../../..";

interface deleteMsgArgs {
  // message: Message;
  // senderId: string;
  msg: Message;
  // teamId: string;
  // roomId: string;
  arr: Message[] | DrObj<Message[]>;
  userId: string;
  isPrivileged: boolean;
}

export function deleteMessageMutation({
  msg,
  arr,
  isPrivileged,
  userId,
}: deleteMsgArgs) {
  if (!isPrivileged && msg.sender !== userId)
    throw new Error("You are not allowed to delete this message");

  const newArr = produce(arr, (draft) => {
    return draft.filter((m) => m.id !== msg.id);
  });

  return newArr as Message[];
}

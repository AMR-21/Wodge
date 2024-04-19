import { produce } from "immer";
import { DrObj, Message, MessageSchema, WorkspaceStructure } from "../../..";
import { dataTagSymbol } from "@tanstack/react-query";

interface sendMsgArgs {
  message: Message;
  // senderId: string;
  // teamId: string;
  // roomId: string;
  arr: Message[];
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function sendMessage({
  message,
  // senderId,
  // teamId,
  // roomId,
  arr,
  structure,
}: sendMsgArgs) {
  const validateFields = MessageSchema.safeParse(message);
  if (!validateFields.success) throw new Error("Invalid message data");

  const { data: newMessage } = validateFields;
  const newStructure = produce(structure, (draft) => {
    arr.push(newMessage);
  });
  return newStructure;
}

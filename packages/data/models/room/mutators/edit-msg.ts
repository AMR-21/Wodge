import { produce } from "immer";
import { DrObj, Message, MessageSchema, WorkspaceStructure } from "../../..";
import { dataTagSymbol } from "@tanstack/react-query";

interface sendMsgArgs {
  message: Message;
  curUserId: string;
  arr: Message[] | DrObj<Message[]>;
  newContent: string;
}

export function editMessageMutation({
  message,
  curUserId,
  arr,
  newContent,
}: sendMsgArgs) {
  const validateFields = MessageSchema.pick({
    content: true,
  }).safeParse({
    content: newContent,
  });

  if (!validateFields.success) throw new Error("Invalid message data");

  if (message.sender !== curUserId) throw new Error("Invalid authorId");

  const msgIdx = arr.findIndex((m) => m.id === message.id);
  if (msgIdx === -1) throw new Error("Message not found");

  const newArr = produce(arr, (draft) => {
    draft[msgIdx]!.content = newContent;
  });

  return newArr as Message[];
}

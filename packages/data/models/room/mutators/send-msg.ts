import { produce } from "immer";
import { DrObj, Message, MessageSchema, WorkspaceStructure } from "../../..";
import { dataTagSymbol } from "@tanstack/react-query";

interface sendMsgArgs {
  message: Message;
  curUserId: string;
  // teamId: string;
  // roomId: string;
  arr: Message[] | DrObj<Message[]>;
  // structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function sendMessageMutation({
  message,
  curUserId,
  // teamId,
  // roomId,
  arr,
  // structure,
}: sendMsgArgs) {
  const validateFields = MessageSchema.safeParse(message);
  if (!validateFields.success) throw new Error("Invalid message data");

  const { data: newMessage } = validateFields;

  if (newMessage.sender !== curUserId) throw new Error("Invalid authorId");

  if (arr.some((msg) => msg.id === newMessage.id))
    throw new Error("Message already exists");

  // const newStructure = produce(structure, (draft) => {
  //   arr.push(newMessage);
  // });

  const newArr = produce(arr, (draft) => {
    draft.push(newMessage);
  });

  return newArr as Message[];
}

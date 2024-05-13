import { produce } from "immer";
import { DrObj, Message, MessageSchema, WorkspaceStructure } from "../../..";

interface sendMsgArgs {
  message: Message;
  curUserId: string;
  // teamId: string;
  // roomId: string;
  arr: Message[] | DrObj<Message[]>;
  // structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function sendMessageMutation({ message, curUserId, arr }: sendMsgArgs) {
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
    draft.push({
      ...newMessage,
      date: new Date().toISOString(),
      ...(newMessage.type === "poll" && {
        votes: Array.from({ length: newMessage.pollOptions.length }, () => 0),
      }),
    });
  });

  return newArr as Message[];
}

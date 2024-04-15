import { produce } from "immer";
import { DrObj, Message, MessageSchema, WorkspaceStructure } from "../../..";

interface sendMsgArgs {
  message: Message;
  // senderId: string;
  teamId: string;
  roomId: string;
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function sendMessage({
  message,
  // senderId,
  teamId,
  roomId,
  structure,
}: sendMsgArgs) {
  const validateFields = MessageSchema.safeParse(message);
  if (!validateFields.success) throw new Error("Invalid message data");

  const { data: newMessage } = validateFields;
  const newStructure = produce(structure, (draft) => {
    const team = draft.teams.find((t) => t.id === teamId);
    if (!team) throw new Error("Team not found");
    const room = team.rooms.find((r) => r.id === roomId);
    if (!room) throw new Error("Room not found");
    room.messages.push(newMessage);
  });
  return newStructure;
}

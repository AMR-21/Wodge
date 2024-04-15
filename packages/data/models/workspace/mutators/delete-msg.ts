import { produce } from "immer";
import { DrObj, Message, MessageSchema, WorkspaceStructure } from "../../..";

interface deleteMsgArgs {
  // message: Message;
  // senderId: string;
  msgId: string;
  teamId: string;
  roomId: string;
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function deleteMsg({ msgId, teamId, roomId, structure }: deleteMsgArgs) {
  const newStructure = produce(structure, (draft) => {
    const team = draft.teams.find((t) => t.id === teamId);
    if (!team) throw new Error("Team not found");
    const room = team.rooms.find((r) => r.id === roomId);
    if (!room) throw new Error("Room not found");
    room.messages = room.messages.filter((m) => m.id !== msgId);
  });
  return newStructure;
}

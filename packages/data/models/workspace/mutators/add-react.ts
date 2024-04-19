import { produce } from "immer";
import {
  DrObj,
  Message,
  MessageSchema,
  React,
  ReactionSchema,
  WorkspaceStructure,
} from "../../..";

interface addReactArgs {
  messageId: string;
  // senderId: string;
  emoji: React["emoji"];
  teamId: string;
  roomId: string;
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function addReact({
  messageId,
  emoji,
  teamId,
  roomId,
  structure,
}: addReactArgs) {
  const newStructure = produce(structure, (draft) => {
    const team = draft.teams.find((t) => t.id === teamId);
    if (!team) throw new Error("Team not found");
    const room = team.rooms.find((r) => r.id === roomId);
    if (!room) throw new Error("Room not found");
    const message = room.messages.find((m) => m.id === messageId);
    if (!message) throw new Error("message not found");
    const reaaact = message.reactions.find((r) => r.emoji === emoji);
    if (reaaact) {
      reaaact.count++;
    } else {
      message.reactions.push({ emoji, count: 1 });
    }
  });

  return newStructure;
}

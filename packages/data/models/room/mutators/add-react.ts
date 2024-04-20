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
  // teamId: string;
  // roomId: string;
  arr: Message[];
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function addReact({ messageId, emoji, arr, structure }: addReactArgs) {
  const newStructure = produce(structure, (draft) => {
    const message = arr.find((r) => r.id === messageId);
    if (!message) throw new Error("message not found");
    const react = message.reactions.find((r) => r.emoji === emoji);
    if (react) {
      react.count++;
    } else {
      message.reactions.push({ emoji: emoji, count: 1 });
    }
  });

  return newStructure;
}

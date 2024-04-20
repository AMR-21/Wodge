import { produce } from "immer";
import {
  DrObj,
  Message,
  MessageSchema,
  React,
  ReactionSchema,
  WorkspaceStructure,
} from "../../..";

interface remReactArgs {
  messageId: string;
  // senderId: string;
  emoji: React["emoji"];
  // teamId: string;
  // roomId: string;
  arr: Message[];
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function removeReact({
  messageId,
  emoji,
  // teamId,
  // roomId,
  arr,
  structure,
}: remReactArgs) {
  const newStructure = produce(structure, (draft) => {
    const message = arr.find((m) => m.id === messageId);
    if (!message) throw new Error("message not found");
    const react = message.reactions.find((r) => r.emoji === emoji);
    if (!react) throw new Error("react not found");
    message.reactions = message.reactions.filter((r) => r.emoji === emoji);
  });
  return newStructure;
}

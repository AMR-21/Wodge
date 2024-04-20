import { produce } from "immer";
import { DrObj, Message, MessageSchema, WorkspaceStructure } from "../../..";

interface deleteMsgArgs {
  // message: Message;
  // senderId: string;
  msgId: string;
  // teamId: string;
  // roomId: string;
  arr: Message[];
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function deleteMsg({ msgId,arr, structure }: deleteMsgArgs) {
  const newStructure = produce(structure, (draft) => {
    arr = arr.filter(m => m.id !== msgId)
  });
  return newStructure;
}

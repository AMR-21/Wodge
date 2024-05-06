import { produce } from "immer";
import {
  DrObj,
  TEAM_MEMBERS_ROLE,
  Thread,
  ThreadMessage,
  ThreadSchema,
  ThreadMessageSchema,
  PublicUserType,
} from "../../..";
import { WorkspaceStructure } from "../../../schemas/workspace.schema";
import { z } from "zod";
export function editThreadMessageMutation({
  msg,
  msgsArray,
  newContent,
  userId,
}: {
  msg: ThreadMessage;
  newContent: string;
  userId: string;
  msgsArray: ThreadMessage[] | DrObj<ThreadMessage[]>;
}) {
  const ContentSchema = z.string().min(1).max(4096);

  const validateFields = ThreadMessageSchema.pick({
    content: true,
  }).safeParse(newContent);

  if (!validateFields.success) throw new Error("Invalid msg data");

  //check if you are allowed to edit the message
  if (userId !== msg.author)
    throw new Error("You are not allowed to edit this message");

  const msgIdx = msgsArray.findIndex((m) => m.id === msg.id);
  //check if the msg exists in the array
  if (msgIdx === -1) throw new Error("Message not found");

  //replace the content of the message using produce
  const newMsgsArray = produce(msgsArray, (draft) => {
    draft = draft.map((m) => {
      if (m.id === msg.id) {
        m.content = newContent;
      }
      return m;
    });
  });
  return newMsgsArray as ThreadMessage[];
}

import { WriteTransaction } from "replicache";
import { PublicUserType } from "../../schemas/user.schema";
import { queryClient } from "../../lib/query-client";
import { ThreadMessage } from "../../schemas/thread.schema";
import { createThreadMessageMutation } from "./mutators/create-thread-message";
import { deleteThreadMessageMutation } from "./mutators/delete-thread-message";
import { editThreadMessageMutation } from "./mutators/edit.thread.message";

export interface EditThreadMessageArg {
  msg: ThreadMessage;
  newContent: string;
}

export const threadMutators = {
  async createMessage(tx: WriteTransaction, data: ThreadMessage) {
    const messages = (await tx.get<ThreadMessage[]>("messages")) || [];

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const newMsgs = createThreadMessageMutation({
      msg: data,
      msgsArray: messages,
      userId: user.id,
    });

    await tx.set("messages", newMsgs);
  },

  async deleteMessage(tx: WriteTransaction, msg: ThreadMessage) {
    const messages = (await tx.get<ThreadMessage[]>("messages")) || [];

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const newMsgs = deleteThreadMessageMutation({
      msgsArray: messages,
      isPrivileged: true,
      userId: user.id,
      msg,
    });

    await tx.set("messages", newMsgs);
  },

  async editMessage(tx: WriteTransaction, edit: EditThreadMessageArg) {
    const messages = (await tx.get<ThreadMessage[]>("messages")) || [];

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const newMsgs = editThreadMessageMutation({
      msg: edit.msg,
      msgsArray: messages,
      userId: user.id,
      newContent: edit.newContent,
    });

    await tx.set("messages", newMsgs);
  },
};

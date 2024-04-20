import { WriteTransaction } from "replicache";
import { PublicUserType } from "../../schemas/user.schema";
import { queryClient } from "../../lib/query-client";
import { ThreadMessage } from "../../schemas/thread.schema";
import { createThreadMessageMutation } from "./mutators/create-thread-message";

export const threadMutators = {
  async createThreadMessage(tx: WriteTransaction, data: ThreadMessage) {
    const messages = (await tx.get<ThreadMessage[]>("messages")) || [];

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const newMessages = createThreadMessageMutation({
      msg: data,
      msgsArray: messages,
      userId: user.id,
    });

    await tx.set("messages", newMessages);
  },
};

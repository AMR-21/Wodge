import { WriteTransaction } from "replicache";
import { sendMessageMutation } from "./mutators/send-msg";
import { Message } from "../../schemas/room.schema";
import { PublicUserType } from "../../schemas/user.schema";
import { queryClient } from "../../lib/query-client";

export const roomMutators = {
  async sendMessage(tx: WriteTransaction, data: Message) {
    const messages = (await tx.get<Message[]>("messages")) || [];

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    console.log({ data });

    if (!user) throw new Error("User not found");

    const newMessages = sendMessageMutation({
      arr: messages,
      message: data,
      curUserId: user.id,
    });

    await tx.set("messages", newMessages);
  },
};

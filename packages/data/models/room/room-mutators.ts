import { WriteTransaction } from "replicache";
import { sendMessageMutation } from "./mutators/send-msg";
import { Message } from "../../schemas/room.schema";
import { PublicUserType } from "../../schemas/user.schema";
import { queryClient } from "../../lib/query-client";
import { deleteMessageMutation } from "./mutators/delete-msg";
import { editMessageMutation } from "./mutators/edit-msg";
import { voteMutation } from "./mutators/vote";
import { removeRoomVoteMutation } from "./mutators/remove-vote";

export interface EditMessageProps {
  message: Message;
  newContent: string;
}
export interface VoteArgs {
  msgId: string;
  option: number;
}

export const roomMutators = {
  async sendMessage(tx: WriteTransaction, data: Message) {
    const messages = (await tx.get<Message[]>("messages")) || [];

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const newMessages = sendMessageMutation({
      arr: messages,
      message: data,
      curUserId: user.id,
    });

    await tx.set("messages", newMessages);
  },
  async deleteMessage(tx: WriteTransaction, data: Message) {
    const messages = (await tx.get<Message[]>("messages")) || [];

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const newMessages = deleteMessageMutation({
      arr: messages,
      msg: data,
      userId: user.id,
      isPrivileged: true,
    });

    await tx.set("messages", newMessages);
  },

  async editMessage(tx: WriteTransaction, data: EditMessageProps) {
    const messages = (await tx.get<Message[]>("messages")) || [];

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const newMessages = editMessageMutation({
      arr: messages,
      message: data.message,
      newContent: data.newContent,
      curUserId: user.id,
    });

    await tx.set("messages", newMessages);
  },
  async vote(tx: WriteTransaction, data: VoteArgs) {
    const msgs = await tx.get<Message[]>("messages");

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const newStructure = voteMutation({
      ...data,
      msgsArr: msgs as Message[],
      msgId: data.msgId,
      curUserId: user.id,
    });

    await tx.set("messages", newStructure);
  },
  async removeVote(tx: WriteTransaction, data: VoteArgs) {
    const msgs = await tx.get<Message[]>("messages");

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const newStructure = removeRoomVoteMutation({
      ...data,
      msgsArr: msgs as Message[],
      msgId: data.msgId,
      curUserId: user.id,
    });

    await tx.set("messages", newStructure);
  },
};

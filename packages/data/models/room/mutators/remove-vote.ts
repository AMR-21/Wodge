import { produce } from "immer";
import { DrObj, Message } from "../../..";

interface VoteArgs {
  msgId: string;
  option: number;
  msgsArr: Message[] | DrObj<Message[]>;
  curUserId: string;
}

export function removeRoomVoteMutation({
  msgId,
  msgsArr,
  option,
  curUserId,
}: VoteArgs) {
  const newArr = produce(msgsArr, (draft) => {
    const msg = draft.find((m) => m.id === msgId);
    // Check if team not found
    if (!msg) throw new Error("Message not found");

    const curVote = msg.pollVoters?.find((v) => v.voter === curUserId);
    if (!curVote) {
      return draft;
    }

    if (msg.pollOptions && option >= msg.pollOptions?.length)
      throw new Error("Invalid option");

    msg.pollVoters = msg.pollVoters?.filter((v) => v.voter !== curUserId);
    msg.votes![curVote.option]!--;
  });
  return newArr as Message[];
}

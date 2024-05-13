import { produce } from "immer";
import { DrObj, Message } from "../../..";

interface VoteArgs {
  msgId: string;
  option: number;
  msgsArr: Message[] | DrObj<Message[]>;
  curUserId: string;
}

export function voteMutation({ option, curUserId, msgId, msgsArr }: VoteArgs) {
  const newArr = produce(msgsArr, (draft) => {
    const msg = draft.find((m) => m.id === msgId);
    // Check if team not found
    if (!msg) throw new Error("Messages not found");

    const curVote = msg.pollVoters?.find((v) => v.voter === curUserId);
    if (curVote) {
      // thread.pollVoters = thread.pollVoters?.filter(
      //   (v) => v.voter !== curUserId
      // );
      // thread.votes![curVote.option]!--;
      throw new Error("User already voted");
    }

    if (msg.pollOptions && option >= msg.pollOptions?.length)
      throw new Error("Invalid option");

    msg.pollVoters?.push({ voter: curUserId, option });
    msg.votes![option] ? msg.votes![option]!++ : (msg.votes![option] = 1);
  });
  return newArr as Message[];
}

import { produce } from "immer";
import { DrObj, Message, ThreadPost } from "../../..";

interface VoteArgs {
  postId: string;
  option: number;
  postsArr: ThreadPost[] | DrObj<ThreadPost[]>;
  curUserId: string;
}

export function postVoteMutation({
  option,
  curUserId,
  postId,
  postsArr,
}: VoteArgs) {
  const newArr = produce(postsArr, (draft) => {
    const post = draft.find((m) => m.id === postId);
    // Check if team not found
    if (!post) throw new Error("Messages not found");

    if (post.type !== "poll") throw new Error("Post is not a poll");

    const curVote = post.pollVoters?.find((v) => v.voter === curUserId);
    if (curVote) {
      // thread.pollVoters = thread.pollVoters?.filter(
      //   (v) => v.voter !== curUserId
      // );
      // thread.votes![curVote.option]!--;
      throw new Error("User already voted");
    }

    if (post.pollOptions && option >= post.pollOptions?.length)
      throw new Error("Invalid option");

    post.pollVoters?.push({ voter: curUserId, option });
    post.votes![option] ? post.votes![option]!++ : (post.votes![option] = 1);
  });
  return newArr as ThreadPost[];
}

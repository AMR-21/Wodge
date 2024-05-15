import { RunnerParams } from "@/lib/replicache";
import { removePostVoteMutation } from "@repo/data/models/thread/mutators/remove-vote";
import ThreadParty from "./thread-party";
import { PostVoteArgs } from "@repo/data";

export async function removeVote(party: ThreadParty, params: RunnerParams) {
  const vote = params.mutation.args as PostVoteArgs;

  party.threadPosts.data = removePostVoteMutation({
    curUserId: params.userId,
    postsArr: party.threadPosts.data,
    ...vote,
  });

  party.threadPosts.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put("posts", party.threadPosts);
}

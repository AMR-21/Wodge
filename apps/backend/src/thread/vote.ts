import { RunnerParams } from "@/lib/replicache";
import { voteMutation } from "@repo/data/models/room/mutators/vote";
import ThreadParty from "./thread-party";
import { PostVoteArgs } from "@repo/data/models/thread/thread-mutators";
import { postVoteMutation } from "@repo/data/models/thread/mutators/vote";
import { produce } from "immer";

export async function vote(party: ThreadParty, params: RunnerParams) {
  const vote = params.mutation.args as PostVoteArgs;

  party.threadPosts = produce(party.threadPosts, (draft) => {
    draft.data = postVoteMutation({
      curUserId: params.userId,
      postsArr: draft.data,
      ...vote,
    });
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put("posts", party.threadPosts);
}

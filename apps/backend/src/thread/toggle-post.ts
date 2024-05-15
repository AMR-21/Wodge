import { RunnerParams } from "../lib/replicache";
import { ThreadPost } from "@repo/data";
import { produce } from "immer";
import ThreadParty from "./thread-party";
import { deletePostMutation } from "@repo/data/models/thread/mutators/delete-post";
import { togglePostMutation } from "@repo/data/models/thread/mutators/toggle-post";

export async function togglePost(
  party: ThreadParty,
  params: RunnerParams,
  isPrivileged: boolean
) {
  const d = togglePostMutation({
    isPrivileged,
    postsArray: party.threadPosts.data,
    curUserId: params.userId,
    postId: params.mutation.args as string,
  });

  party.threadPosts = produce(party.threadPosts, (draft) => {
    draft.data = d;
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put("posts", party.threadPosts);
}

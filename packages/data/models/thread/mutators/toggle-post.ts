import { produce } from "immer";
import { DrObj, ThreadPost } from "../../..";

interface ToggleThreadArgs {
  postId: string;
  postsArray: ThreadPost[] | DrObj<ThreadPost[]>;
  curUserId: string;
  isPrivileged: boolean;
}

export function togglePostMutation({
  isPrivileged,
  postId,
  postsArray,
  curUserId,
}: ToggleThreadArgs) {
  // Validate the data

  const newArr = produce(postsArray, (draft) => {
    const post = draft.find((p) => p.id === postId);
    // Check if team not found
    if (!post) throw new Error("post not found");

    if (!isPrivileged && curUserId !== post?.author)
      throw new Error("You are not the creator of this thread");
    post.isResolved = !post.isResolved;
  });

  return newArr as ThreadPost[];
}

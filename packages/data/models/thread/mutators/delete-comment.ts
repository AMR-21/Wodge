import { produce } from "immer";
import { DrObj, ThreadMessage, ThreadPost } from "../../..";

export function deleteCommentMutation({
  comment,
  postId,
  postsArray,
  userId,
  isPrivileged,
}: {
  postId: string;
  comment: ThreadMessage | DrObj<ThreadMessage>;
  postsArray: ThreadPost[] | DrObj<ThreadPost[]>;
  userId: string;
  isPrivileged: boolean;
}) {
  //check if the current userId is the author of the message or he has the role of owner or admin in the team
  if (comment.author !== userId && !isPrivileged)
    throw new Error("You are not allowed to delete this message");
  // delete the message using produce
  const newPostsArray = produce(postsArray, (draft) => {
    const postIdx = draft.findIndex((p) => p.id === postId);
    if (postIdx === -1) return draft;
    draft[postIdx]!.comments = draft[postIdx]!.comments.filter(
      (c) => c.id !== comment.id
    );
    return draft;
  });
  return newPostsArray as ThreadPost[];
}

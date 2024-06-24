import { produce } from "immer";
import {
  DrObj,
  ThreadMessage,
  ThreadMessageSchema,
  ThreadPost,
} from "../../..";

export function createCommentMutation({
  comment,
  postId,
  postsArray,
  userId,
  isPrivileged,
}: {
  postId: string;
  comment: ThreadMessage;
  postsArray: ThreadPost[] | DrObj<ThreadPost[]>;
  userId: string;
  isPrivileged: boolean;
}) {
  const validateFields = ThreadMessageSchema.safeParse(comment);
  if (!validateFields.success) throw new Error("Invalid msg data");

  //check the msg structure like the thread message structure if ok push the msg in the msgs array
  const { data: newComment } = validateFields;
  if (newComment.author !== userId) throw new Error("author error");

  const newPostsArray = produce(postsArray, (draft) => {
    const post = draft.find((p) => p.id === postId);
    if (!post) throw new Error("post not found");

    if (
      !isPrivileged &&
      post.author !== userId &&
      (comment.type === "open" || comment.type === "close")
    )
      throw new Error("not privileged");

    if (post.isResolved && comment.type === "message")
      throw new Error("post is resolved");

    //check if the message is unique in the array
    if (post.comments.some((c) => c.id === newComment.id))
      throw new Error("message already exists");
    post.comments.push({ ...newComment, createdAt: new Date().toISOString() });
  });

  return newPostsArray as ThreadPost[];
}

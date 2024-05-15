import { produce } from "immer";
import {
  DrObj,
  ThreadMessage,
  ThreadMessageSchema,
  ThreadPost,
} from "../../..";
export function editPostMutation({
  post,
  postsArray,
  newContent,
  userId,
}: {
  post: ThreadPost;
  newContent: string;
  userId: string;
  postsArray: ThreadPost[] | DrObj<ThreadPost[]>;
}) {
  const validateFields = ThreadMessageSchema.pick({
    content: true,
  }).safeParse({ content: newContent });

  if (!validateFields.success) {
    console.log(validateFields.error.flatten());
    throw new Error("Invalid msg data");
  }

  //check if you are allowed to edit the message
  if (userId !== post.author)
    throw new Error("You are not allowed to edit this message");

  //replace the content of the message using produce
  const newPostsArray = produce(postsArray, (draft) => {
    const curPost = draft.find((p) => p.id === post.id);
    if (!curPost) return draft;

    curPost.content = newContent;
    curPost.isEdited = true;
    curPost.createdAt = new Date().toISOString();

    return draft;
  });
  return newPostsArray as ThreadPost[];
}

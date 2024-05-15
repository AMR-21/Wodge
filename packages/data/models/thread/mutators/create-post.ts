import { produce } from "immer";
import {
  DrObj,
  ThreadMessage,
  ThreadMessageSchema,
  ThreadPost,
  ThreadPostSchema,
} from "../../..";

export function createPostMutation({
  post,
  postsArray,
  userId,
}: {
  post: ThreadPost;
  postsArray: ThreadPost[] | DrObj<ThreadPost[]>;
  userId: string;
}) {
  const validateFields = ThreadPostSchema.safeParse(post);
  if (!validateFields.success) throw new Error("Invalid msg data");

  //check the msg structure like the thread message structure if ok push the msg in the msgs array
  const { data: newPost } = validateFields;
  if (post.author !== userId) throw new Error("author error");

  if (postsArray.some((p) => p.id === newPost.id))
    throw new Error("post already exists");

  const newPostsArray = produce(postsArray, (draft) => {
    //check if the message is unique in the array
    draft.unshift({ ...newPost, createdAt: new Date().toISOString() });
  });

  return newPostsArray as ThreadPost[];
}

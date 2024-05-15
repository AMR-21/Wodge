import { WriteTransaction } from "replicache";
import { PublicUserType } from "../../schemas/user.schema";
import { queryClient } from "../../lib/query-client";
import { ThreadMessage, ThreadPost } from "../../schemas/thread.schema";
import { deleteCommentMutation } from "./mutators/delete-comment";
import { editCommentMutation } from "./mutators/edit-comment";
import { createCommentMutation } from "./mutators/create-comment";
import { createPostMutation } from "./mutators/create-post";
import { deletePostMutation } from "./mutators/delete-post";
import { editPostMutation } from "./mutators/edit-post";
import { togglePostMutation } from "./mutators/toggle-post";
import { postVoteMutation } from "./mutators/vote";
import { removePostVoteMutation } from "./mutators/remove-vote";

export interface EditThreadMessageArg {
  comment: ThreadMessage;
  newContent: string;
  postId: string;
}
export interface PostVoteArgs {
  postId: string;
  option: number;
}
export const threadMutators = {
  async createPost(tx: WriteTransaction, data: ThreadPost) {
    const posts = (await tx.get<ThreadPost[]>("posts")) || [];

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const newMsgs = createPostMutation({
      userId: user.id,
      post: data,
      postsArray: posts,
    });

    await tx.set("posts", newMsgs);
  },

  async deletePost(tx: WriteTransaction, post: ThreadPost) {
    const posts = (await tx.get<ThreadPost[]>("posts")) || [];

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const newPosts = deletePostMutation({
      isPrivileged: true,
      userId: user.id,
      post,
      postsArray: posts,
    });

    await tx.set("posts", newPosts);
  },
  async editPost(
    tx: WriteTransaction,
    post: ThreadPost & { newContent: string }
  ) {
    const posts = (await tx.get<ThreadPost[]>("posts")) || [];

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");
    const { newContent, ...curPost } = post;
    const newPosts = editPostMutation({
      userId: user.id,
      post: curPost,
      postsArray: posts,
      newContent: newContent,
    });

    await tx.set("posts", newPosts);
  },

  async createComment(
    tx: WriteTransaction,
    data: ThreadMessage & { postId: string }
  ) {
    const posts = (await tx.get<ThreadPost[]>("posts")) || [];

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    const { postId, ...comment } = data;
    if (!user) throw new Error("User not found");

    const newPosts = createCommentMutation({
      postId,
      postsArray: posts,
      comment,
      userId: user.id,
    });

    await tx.set("posts", newPosts);
  },

  async deleteComment(
    tx: WriteTransaction,
    args: ThreadMessage & { postId: string }
  ) {
    const posts = (await tx.get<ThreadPost[]>("posts")) || [];

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const { postId, ...comment } = args;
    const newPosts = deleteCommentMutation({
      isPrivileged: true,
      userId: user.id,
      comment,
      postId,
      postsArray: posts,
    });

    await tx.set("posts", newPosts);
  },

  async editComment(tx: WriteTransaction, args: EditThreadMessageArg) {
    const posts = (await tx.get<ThreadPost[]>("posts")) || [];

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const newPosts = editCommentMutation({
      userId: user.id,
      newContent: args.newContent,
      comment: args.comment,
      postId: args.postId,
      postsArray: posts,
    });

    await tx.set("posts", newPosts);
  },
  async togglePost(tx: WriteTransaction, postId: string) {
    const posts = (await tx.get<ThreadPost[]>("posts")) || [];

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const newPosts = togglePostMutation({
      postId,
      curUserId: user.id,
      isPrivileged: true,
      postsArray: posts,
    });

    await tx.set("posts", newPosts);
  },

  async vote(tx: WriteTransaction, data: PostVoteArgs) {
    const posts = await tx.get<ThreadPost[]>("posts");

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const newStructure = postVoteMutation({
      ...data,
      postsArr: posts as ThreadPost[],
      postId: data.postId,
      curUserId: user.id,
    });

    await tx.set("posts", newStructure);
  },
  async removeVote(tx: WriteTransaction, data: PostVoteArgs) {
    const posts = await tx.get<ThreadPost[]>("posts");

    const user = queryClient.getQueryData<PublicUserType>(["user"]);

    if (!user) throw new Error("User not found");

    const newStructure = removePostVoteMutation({
      ...data,
      postsArr: posts as ThreadPost[],
      postId: data.postId,
      curUserId: user.id,
    });

    await tx.set("posts", newStructure);
  },
};

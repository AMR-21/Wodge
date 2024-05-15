import {
  Thread,
  ThreadMessage as ThreadMessageType,
  threadMutators,
  ThreadPost,
} from "@repo/data";
import { memo, useEffect } from "react";
import { ReadTransaction, Replicache } from "replicache";
import { useSubscribe } from "@/hooks/use-subscribe";
import { ThreadMessage } from "./thread-message";

export const ThreadMessagesList = memo(
  ({
    rep,
    comments,
    post,
    isQA = false,
  }: {
    rep?: Replicache<typeof threadMutators>;
    comments?: ThreadMessageType[];
    post?: ThreadPost;
    isQA?: boolean;
  }) => {
    async function onDeleteMsg(comment: ThreadMessageType) {
      if (!post) return;
      await rep?.mutate.deleteComment({
        ...comment,
        postId: post?.id,
      });
    }

    async function onEditMsg(comment: ThreadMessageType, newContent: string) {
      if (!post) return;
      await rep?.mutate.editComment({
        comment,
        postId: post?.id,
        newContent,
      });
    }

    if (!comments) return null;

    return (
      <div className={!isQA ? "py-2.5" : "mb-2.5"}>
        {!isQA && comments.length > 0 && (
          <p className="pb-2 text-sm font-medium text-muted-foreground">
            Comments
          </p>
        )}

        <div className="flex flex-col gap-2.5">
          {comments?.map((m) => (
            <ThreadMessage
              type={isQA ? "qa" : "post"}
              comment={m}
              key={m.id}
              onDeleteMsg={onDeleteMsg}
              onEditMsg={onEditMsg}
              isResolved={post?.isResolved}
            />
          ))}
        </div>
      </div>
    );
  },
);

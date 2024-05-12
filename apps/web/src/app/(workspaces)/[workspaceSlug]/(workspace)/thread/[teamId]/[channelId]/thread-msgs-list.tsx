import {
  Thread,
  ThreadMessage as ThreadMessageType,
  threadMutators,
} from "@repo/data";
import { memo, useEffect } from "react";
import { ReadTransaction, Replicache } from "replicache";
import { useSubscribe } from "@/hooks/use-subscribe";
import { ThreadMessage } from "./thread-message";

export const ThreadMessagesList = memo(
  ({
    rep,
    thread,
  }: {
    rep?: Replicache<typeof threadMutators>;
    thread: Thread;
  }) => {
    const { snapshot: messages, isPending } = useSubscribe(
      rep,
      (tx: ReadTransaction) => tx.get<ThreadMessageType[]>("messages"),
    );

    async function onDeleteMsg(msg: ThreadMessageType) {
      await rep?.mutate.deleteMessage(msg);
    }

    async function onEditMsg(msg: ThreadMessageType, newContent: string) {
      await rep?.mutate.editMessage({
        msg,
        newContent,
      });
    }

    if (!messages) return null;

    return (
      <div className="py-2.5">
        {thread.type === "post" && messages && messages.length > 0 && (
          <p className="pb-2 text-sm font-medium text-muted-foreground">
            Comments
          </p>
        )}

        <div className="flex flex-col gap-2.5">
          {messages?.map((m) => (
            <ThreadMessage
              type={thread.type}
              msg={m}
              key={m.id}
              onDeleteMsg={onDeleteMsg}
              onEditMsg={onEditMsg}
              isResolved={thread.isResolved}
            />
          ))}
        </div>
      </div>
    );
  },
);

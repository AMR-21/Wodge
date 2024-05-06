import {
  Thread,
  ThreadMessage as ThreadMessageType,
  threadMutators,
} from "@repo/data";
import { memo } from "react";
import { ReadTransaction, Replicache } from "replicache";
import { useSubscribe } from "@repo/ui/hooks/use-subscribe";
import { ThreadMessage } from "./thread-message";

export const ThreadMessagesList = memo(
  ({
    rep,
    type,
  }: {
    rep?: Replicache<typeof threadMutators>;
    type: Thread["type"];
  }) => {
    const { snapshot: messages } = useSubscribe(rep, (tx: ReadTransaction) =>
      tx.get<ThreadMessageType[]>("messages"),
    );

    if (!messages) return null;

    return (
      <div className="py-4">
        {type === "post" && (
          <p className="pb-2 text-sm font-medium text-muted-foreground">
            Comments
          </p>
        )}

        <div className="flex flex-col gap-2.5">
          {messages?.map((m) => (
            <ThreadMessage type={type} msg={m} key={m.id} />
          ))}
        </div>
      </div>
    );
  },
);

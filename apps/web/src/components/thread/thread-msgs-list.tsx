import { nanoid } from "nanoid";
import { ThreadAction } from "./thread-actions";
import {
  PublicUserType,
  ThreadMessage as ThreadMessageType,
  threadMutators,
} from "@repo/data";
import { memo } from "react";
import { ReadTransaction, Replicache } from "replicache";
import { useSubscribe } from "@repo/ui/hooks/use-subscribe";
import { ThreadMessage } from "./thread-message";

export const ThreadMessagesList = memo(
  ({ rep }: { rep?: Replicache<typeof threadMutators> }) => {
    const { snapshot: messages } = useSubscribe(rep, (tx: ReadTransaction) =>
      tx.get<ThreadMessageType[]>("messages"),
    );

    return <>{messages?.map((m) => <ThreadMessage msg={m} key={m.id} />)}</>;
  },
);

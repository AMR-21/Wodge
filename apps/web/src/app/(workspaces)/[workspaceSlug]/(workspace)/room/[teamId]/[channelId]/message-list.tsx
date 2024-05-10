import { atom, useAtomValue, useSetAtom } from "jotai";
import { Message } from "./message";
import { memo, useEffect, useLayoutEffect, useRef } from "react";
import { Message as MessageType, roomMutators } from "@repo/data";
import { ReadTransaction, Replicache } from "replicache";
import { useSubscribe } from "@repo/ui/hooks/use-subscribe";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useParams } from "next/navigation";

export const lastSenderIdAtom = atom<string>("");

export const MessageList = memo(
  ({ rep }: { rep?: Replicache<typeof roomMutators> }) => {
    const { snapshot: messages } = useSubscribe(rep, (tx: ReadTransaction) =>
      tx.get<MessageType[]>("messages"),
    );

    const { workspaceId } = useCurrentWorkspace();
    const { teamId, channelId } = useParams<{
      teamId: string;
      channelId: string;
    }>();

    const listRef = useRef<HTMLDivElement>(null);

    function scrollList() {
      listRef.current?.scrollIntoView({
        block: "end",
      });
    }
    useEffect(() => {
      if (listRef.current)
        // listRef.current.scrollTop = listRef.current.scrollHeight;
        listRef.current.scrollIntoView({
          block: "end",
        });
    }, [messages]);

    async function onDelete(msg: MessageType) {
      await rep?.mutate.deleteMessage(msg);
    }

    async function onEdit(msg: MessageType, newContent: string) {
      await rep?.mutate.editMessage({ message: msg, newContent });
    }

    if (!workspaceId) return null;

    if (!messages || messages.length === 0) return null;

    return (
      <div className="flex flex-col pb-2 pt-4" ref={listRef}>
        {messages?.map((m, i, arr) => {
          return (
            <Message
              message={m}
              key={m.id}
              prevMsg={messages[i - 1]}
              workspaceId={workspaceId}
              onDelete={onDelete}
              onSuccessEdit={onEdit}
            />
          );
        })}
        {/* <div className="h-2 w-2 bg-red-400" ref={ref} />; */}
      </div>
    );
  },
);

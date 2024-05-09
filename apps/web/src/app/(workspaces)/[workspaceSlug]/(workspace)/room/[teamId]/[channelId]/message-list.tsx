import { atom, useAtomValue, useSetAtom } from "jotai";
import { Message } from "./message";
import { memo, useEffect, useLayoutEffect, useRef } from "react";
import { Message as MessageType, roomMutators } from "@repo/data";
import { ReadTransaction, Replicache } from "replicache";
import { useSubscribe } from "@repo/ui/hooks/use-subscribe";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useParams } from "next/navigation";
import Image from "next/image";

import Img from "./img.png";

export const msgsAtom = atom<MessageType[]>([
  {
    sender: "AsojFlHm9Vd9CxoFcQ5Ww",
    content: `asdasd
# asdasda
sadasdasd
## asdasdasd
→ zebbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbby`,
    date: "2021-10-11T14:48:00.000Z",
    id: "1",
    type: "text",
    reactions: [],
  },
  {
    sender: "AsojFlHm9Vd9CxoFcQ5Ww",
    content: `asdsaadasd`,
    date: "2021-10-11T14:48:00.000Z",
    id: "2",
    type: "text",
    reactions: [],
  },
  {
    content: "",
    date: "2064-04-18T15:34:02.130Z",
    id: "eSiQ2yCVX0H64azuLpp-5",
    sender: "AsojFlHm9Vd9CxoFcQ5Ww",
    type: "image",
    reactions: [],
  },
  // {
  //   sender: "AsojFlHm9Vd9CxoFcQ5Ww",
  //   content: `asdsaadasd`,
  //   date: "2021-10-11T14:48:00.000Z",
  //   id: "3",
  // },
  // {
  //   sender: "AsojFlHm9Vd9CxoFcQ5Ww",
  //   content: `asdsaadasd`,
  //   date: "2021-10-11T14:48:00.000Z",
  //   id: "4",
  // },
  // {
  //   sender: "AsojFlHm9Vd9CxoFcQ5Ww",
  //   content: `http://localhost:3000/asdsaz/room/yYqfuu6BbgsCdYOx/fpSRx0aBscjjq7_8x8usG`,
  //   date: "2021-10-11T14:48:00.000Z",
  //   id: "5",
  // },
  // {
  //   sender: "AsojFlHm9Vd9CxoFcQ5Ww",
  //   content: `asd

  //   `,
  //   date: "2021-10-11T14:48:00.000Z",
  //   id: "6",
  // },
  // {
  //   sender: "AsojFlHm9Vd9CxoFcQ5Ww",
  //   content: `asdsaadasd
  //   `,
  //   date: "2021-10-11T14:48:00.000Z",
  //   id: "7",
  // },
  // {
  //   sender: "AsojFlHm9Vd9CxoFcQ5Ww",
  //   content: `asdsaadasd
  //   `,
  //   date: "2021-10-11T14:48:00.000Z",
  //   id: "8",
  // },
]);

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
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (listRef.current)
        // listRef.current.scrollTop = listRef.current.scrollHeight;
        listRef.current.scrollIntoView({
          block: "end",
        });
    }, [messages]);

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
            />
          );
        })}
        {/* <div className="h-2 w-2 bg-red-400" ref={ref} />; */}
      </div>
    );
  },
);

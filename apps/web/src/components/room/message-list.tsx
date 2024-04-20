import { atom, useAtomValue, useSetAtom } from "jotai";
import { Message } from "./message";
import { memo, useEffect, useLayoutEffect, useRef } from "react";
import { Message as MessageType, roomMutators } from "@repo/data";
import { ReadTransaction, Replicache } from "replicache";
import { useSubscribe } from "@repo/ui/hooks/use-subscribe";

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
    date: "2024-04-18T15:34:02.130Z",
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

    return (
      <div className="flex flex-col gap-2 pb-2 pt-4" ref={listRef}>
        {messages?.map((m, i) => {
          if (i === messages.length - 1)
            setTimeout(() => {
              scrollList();
            }, 300);

          return (
            <Message
              message={m}
              key={m.id}
              lastSenderId={i > 0 ? m.sender : ""}
            />
          );
        })}
      </div>
    );
  },
);

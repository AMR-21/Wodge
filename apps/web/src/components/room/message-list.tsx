import { atom, useAtomValue, useSetAtom } from "jotai";
import { Message } from "./message";
import { useEffect, useLayoutEffect, useRef } from "react";

export interface Message {
  sender: string;
  content: string;
  date: string;
  id: string;
}

export const msgsAtom = atom<Message[]>([
  {
    sender: "AsojFlHm9Vd9CxoFcQ5Ww",
    content: `asdasd
# asdasda
sadasdasd
## asdasdasd
→ zebbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbby`,
    date: "2021-10-11T14:48:00.000Z",
    id: "1",
  },
  {
    sender: "AsojFlHm9Vd9CxoFcQ5Ww",
    content: `asdsaadasd`,
    date: "2021-10-11T14:48:00.000Z",
    id: "2",
  },
  {
    sender: "AsojFlHm9Vd9CxoFcQ5Ww",
    content: `asdsaadasd`,
    date: "2021-10-11T14:48:00.000Z",
    id: "3",
  },
  {
    sender: "AsojFlHm9Vd9CxoFcQ5Ww",
    content: `asdsaadasd`,
    date: "2021-10-11T14:48:00.000Z",
    id: "4",
  },
  {
    sender: "AsojFlHm9Vd9CxoFcQ5Ww",
    content: `asdsaadasd`,
    date: "2021-10-11T14:48:00.000Z",
    id: "5",
  },
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

export function MessageList() {
  const messages = useAtomValue(msgsAtom);

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
    <div
      className="flex flex-col gap-2 overflow-hidden pb-2 pt-4"
      ref={listRef}
    >
      {messages.map((m, i) => {
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
}

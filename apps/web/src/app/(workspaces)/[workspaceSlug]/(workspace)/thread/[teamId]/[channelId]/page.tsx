"use client";

import { ThreadMessage as ThreadMessageType } from "@repo/data";
import { SimpleEditor } from "@repo/editor";
import { useChannelPath } from "@repo/ui/hooks/use-channel-path";

const messages: ThreadMessageType[] = [
  {
    id: "asd",
    author: "AsojFlHm9Vd9CxoFcQ5Ww",
    content: "my first message",
  },
  {
    id: "asd",
    author: "AsojFlHm9Vd9CxoFcQ5Ww",
    content: "my second message",
  },
];

function ChannelPage() {
  const path = useChannelPath();

  if (!path) return null;

  const { team, thread } = path;

  return (
    <div className="flex h-full max-h-dvh flex-col gap-4 overflow-y-scroll bg-yellow-300 p-1.5">
      <header className="">
        <h2 className="text-2xl font-semibold">{thread} posts</h2>
      </header>

      <div className="relative flex flex-col gap-5">
        <div className="absolute left-5 h-full w-[2px] bg-border/70" />
        {messages.map((m) => (
          <ThreadMessage msg={m} key={m.id} />
        ))}
      </div>

      <div className="mt-auto ">
        <SimpleEditor />
      </div>
    </div>
  );
}

function ThreadMessage({ msg }: { msg: ThreadMessageType }) {
  return (
    <div className="z-10 w-full rounded-md border border-border/50 bg-dim px-2 py-4">
      {msg.content}
    </div>
  );
}

export default ChannelPage;

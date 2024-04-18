"use client";

import { SidebarItemBtn } from "@/components/workspace/sidebar-item-btn";
import { ThreadMessage as ThreadMessageType } from "@repo/data";
import { SimpleEditor, useMessageEditor, useThreadEditor } from "@repo/editor";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { useChannelPath } from "@repo/ui/hooks/use-channel-path";
import { Send } from "lucide-react";

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

  const editor = useThreadEditor();

  if (!path) return null;

  const { team, thread } = path;

  return (
    <div className="flex h-full max-h-dvh w-full flex-col gap-4 p-1.5">
      <header className="">
        <h2 className="text-2xl font-semibold">{thread} posts</h2>
      </header>

      <ScrollArea>
        <div className="relative mb-6 flex flex-col gap-5">
          <div className="absolute left-5 h-full w-[2px] bg-border/70" />
          {messages.map((m) => (
            <ThreadMessage msg={m} key={m.id} />
          ))}
        </div>

        <div className="flex shrink-0 items-end rounded-md border border-border/50 bg-secondary/40 px-1.5 py-1">
          {/* <UploadButton bucketId={workspaceId} /> */}

          <div
            className="flex h-full w-full items-center overflow-hidden"
            onKeyDown={(e) => {
              if (e.code === "Enter" && !e.shiftKey && !e.ctrlKey) {
                // onSubmit();
              }
            }}
          >
            <SimpleEditor editor={editor} isThread />
          </div>
          <SidebarItemBtn
            Icon={Send}
            className="ml-2"
            // onClick={onSubmit}
          />
        </div>
      </ScrollArea>
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

"use client";

import { SafeDiv } from "@/components/safe-div";
import { SidebarItemBtn } from "@/components/workspace/sidebar-item-btn";
import { ThreadMessage as ThreadMessageType } from "@repo/data";
import { SimpleEditor, useMessageEditor, useThreadEditor } from "@repo/editor";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { useChannelPath } from "@repo/ui/hooks/use-channel-path";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useMember } from "@repo/ui/hooks/use-member";
import { format } from "date-fns";
import { atom, useAtom } from "jotai";
import { MoreHorizontal, Send } from "lucide-react";
import { nanoid } from "nanoid";

const threadMessages = atom<ThreadMessageType[]>([
  {
    id: "asd",
    author: "AsojFlHm9Vd9CxoFcQ5Ww",
    content: "my first message",
    date: "2021-09-01T12:00:00",
  },
  {
    id: "asd2",
    author: "AsojFlHm9Vd9CxoFcQ5Ww",
    content: "my second message",
    date: "2021-09-01T12:00:00",
  },
]);

function ChannelPage() {
  const path = useChannelPath();

  const editor = useThreadEditor();

  const [messages, setMessages] = useAtom(threadMessages);

  const { user } = useCurrentUser();

  if (!path) return null;

  const { team, thread } = path;

  function onSubmit() {
    if (editor && user) {
      const content = editor.getHTML();
      setMessages((msgs) => [
        ...msgs,
        {
          id: nanoid(),
          author: user.id,
          content,
          date: new Date().toISOString(),
        },
      ]);

      editor.commands.clearContent();
    }
  }

  return (
    <div className="flex h-full max-h-dvh w-full flex-col gap-4 p-1.5">
      <header className="flex items-center pr-2">
        <h2 className="text-2xl font-semibold">{thread} posts</h2>
        <Button className="ml-auto" size="sm">
          Resolve
        </Button>
      </header>

      <ScrollArea className="pr-2">
        <div className="relative mb-6 flex flex-col gap-5">
          <div className="absolute left-5 h-full w-[2px] bg-border/70" />
          {messages.map((m) => (
            <ThreadMessage msg={m} key={m.id} />
          ))}
        </div>

        <div className="flex shrink-0 items-end rounded-md border border-border/50 bg-secondary/40 px-1.5 py-1">
          {/* <UploadButton bucketId={workspaceId} /> */}

          <div className="flex h-full w-full items-center overflow-hidden">
            <SimpleEditor editor={editor} isThread />
          </div>
          <SidebarItemBtn Icon={Send} className="ml-2" onClick={onSubmit} />
        </div>
      </ScrollArea>
    </div>
  );
}

function ThreadMessage({ msg }: { msg: ThreadMessageType }) {
  const { member } = useMember(msg.author);
  return (
    <div className="z-10 w-full rounded-md border border-border/50 bg-dim px-2 py-4">
      <div className="flex items-start gap-2">
        <Avatar className="h-7 w-7">
          <AvatarImage src={member?.avatar} alt={member?.displayName} />
          <AvatarFallback>{member?.displayName[0]}</AvatarFallback>
        </Avatar>

        <div className="flex items-center gap-2">
          <p className="text-sm">{member?.displayName}</p>
          <p className="pt-0.5 text-xs text-muted-foreground">
            {format(msg.date, "yyyy/MM/dd h:mm a")}
          </p>
        </div>

        <SidebarItemBtn
          Icon={MoreHorizontal}
          className="ml-auto transition-all"
        />
      </div>

      <SafeDiv className="BlockEditor pl-9 text-sm" html={msg.content} />
    </div>
  );
}

export default ChannelPage;

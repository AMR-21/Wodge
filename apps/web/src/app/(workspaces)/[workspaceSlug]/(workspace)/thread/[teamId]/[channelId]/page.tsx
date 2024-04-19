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
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useMember } from "@repo/ui/hooks/use-member";
import { format } from "date-fns";
import { atom, useAtom } from "jotai";
import {
  CheckCircle,
  CheckCircle2,
  CircleDot,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const threadMessages = atom<ThreadMessageType[]>([
  {
    id: "asd",
    author: "TjhBT7b4wJnsVgM_RMX2r",
    content: "my first message",
    date: "2021-09-01T12:00:00",
    type: "message",
  },
  {
    id: "asd2",
    author: "TjhBT7b4wJnsVgM_RMX2r",
    content: "my second message",
    date: "2021-09-01T12:00:00",
    type: "message",
  },
  {
    id: "asd32",
    author: "TjhBT7b4wJnsVgM_RMX2r",
    content: "",
    date: "2021-09-01T12:00:00",
    type: "close",
  },
]);

function ChannelPage() {
  const path = useChannelPath();

  const [messages, setMessages] = useAtom(threadMessages);

  const { user } = useCurrentUser();

  const { teamId, channelId } = useParams<{
    teamId: string;
    channelId: string;
  }>();

  const { member } = useMember(path?.createdBy);
  const editor = useThreadEditor();
  const { workspaceRep } = useCurrentWorkspace();

  useEffect(() => {
    if (path?.isResolved) {
      editor?.setEditable(false);
      editor?.commands.clearContent();
    } else {
      editor?.setEditable(true);
    }
  }, [path]);

  if (!path) return null;

  const { team, thread: threadName, createdBy, isResolved } = path;

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
          type: "message",
        },
      ]);

      editor.commands.clearContent();
    }
  }

  async function toggleThread() {
    // add message to thread
    if (user)
      setMessages((msgs) => [
        ...msgs,
        {
          id: nanoid(),
          author: user.id,
          content: "",
          date: new Date().toISOString(),
          type: isResolved ? "open" : "close",
        },
      ]);
    await workspaceRep?.mutate.toggleThread({
      teamId,
      threadId: channelId,
    });
  }

  return (
    <div className="flex h-full max-h-dvh w-full flex-col gap-4 p-1.5">
      <header className="flex items-center pr-2">
        <h2 className="text-2xl font-semibold">{threadName} thread</h2>
        <Button className="ml-auto" size="sm" onClick={toggleThread}>
          {isResolved ? "Open" : "Close"} thread
        </Button>
      </header>

      <ScrollArea className="pr-2">
        <div className="relative mb-6 flex flex-col gap-5">
          <div className="absolute left-5 top-1/2 h-[90%] w-[2px] -translate-y-1/2 bg-border/70" />

          <div className="z-50 flex items-center gap-3 pl-[0.5625rem] text-sm">
            <CircleDot className="h-6 w-6 shrink-0 rounded-full bg-green-600 p-1 text-green-50" />
            <div className="flex gap-1">
              <p>@{member?.username}</p>
              <p className="text-muted-foreground">created the thread</p>
            </div>
          </div>

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

  if (msg.type === "open")
    return (
      <div className="z-50 flex items-center gap-3 pl-[0.5625rem] text-sm">
        <CircleDot className="h-6 w-6 shrink-0 rounded-full bg-green-600 p-1 text-green-50" />
        <div className="flex gap-1">
          <p>@{member?.username}</p>
          <p className="text-muted-foreground">reopened the thread</p>
          <p className="pt-0.5 text-xs text-muted-foreground">
            {format(msg.date, "yyyy/MM/dd h:mm a")}
          </p>
        </div>
      </div>
    );

  if (msg.type === "close")
    return (
      <div className="z-50 flex items-center gap-3 pl-[0.5625rem] text-sm">
        <CheckCircle2 className="h-6 w-6 shrink-0 rounded-full bg-purple-600 p-1 text-purple-50" />
        <div className="flex gap-1">
          <p>@{member?.username}</p>
          <p className="text-muted-foreground">closed the thread</p>
          <p className="pt-0.5 text-xs text-muted-foreground">
            {format(msg.date, "yyyy/MM/dd h:mm a")}
          </p>
        </div>
      </div>
    );

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

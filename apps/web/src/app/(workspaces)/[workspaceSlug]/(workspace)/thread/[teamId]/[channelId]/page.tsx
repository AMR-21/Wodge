"use client";

import { ThreadAction } from "@/components/thread/thread-actions";
import { ThreadMessagesList } from "@/components/thread/thread-msgs-list";
import { SidebarItemBtn } from "@/components/workspace/sidebar-item-btn";
import { SimpleEditor, useThreadEditor } from "@repo/editor";
import { Button } from "@repo/ui/components/ui/button";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { useChannelPath } from "@repo/ui/hooks/use-channel-path";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useMember } from "@repo/ui/hooks/use-member";
import { useCurrentThreadRep } from "@repo/ui/hooks/use-thread-rep";
import { Send } from "lucide-react";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";
import { useEffect } from "react";

function ChannelPage() {
  const path = useChannelPath();

  const { user } = useCurrentUser();

  const { teamId, channelId } = useParams<{
    teamId: string;
    channelId: string;
  }>();

  const { member } = useMember(path?.createdBy);
  const editor = useThreadEditor();
  const { workspaceRep } = useCurrentWorkspace();

  const rep = useCurrentThreadRep();

  useEffect(() => {
    if (path?.isResolved) {
      editor?.setEditable(false);
      editor?.commands.clearContent();
    } else {
      editor?.setEditable(true);
    }
  }, [path]);

  if (!path) return null;

  const { thread: threadName, createdBy, isResolved } = path;

  async function onSubmit() {
    if (editor && user) {
      const content = editor.getHTML();

      await rep?.mutate.createThreadMessage({
        id: nanoid(),
        author: user.id,
        content,
        date: new Date().toISOString(),
        type: "message",
      });

      editor.commands.clearContent();
    }
  }

  async function toggleThread() {
    // add message to thread
    if (user)
      await rep?.mutate.createThreadMessage({
        id: nanoid(),
        author: user.id,
        content: "toggle",
        date: new Date().toISOString(),
        type: isResolved ? "open" : "close",
      });

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
          <ThreadAction
            msg={{
              id: "",
              author: createdBy || "",
              content: "",
              type: "open",
              date: "",
            }}
            member={member}
          />

          <ThreadMessagesList rep={rep} />
        </div>

        <div className="flex shrink-0 items-end rounded-md border border-border/50 bg-secondary/40 px-1.5 py-1">
          <div className="flex h-full w-full items-center overflow-hidden">
            <SimpleEditor editor={editor} isThread />
          </div>
          <SidebarItemBtn Icon={Send} className="ml-2" onClick={onSubmit} />
        </div>
      </ScrollArea>
    </div>
  );
}

export default ChannelPage;

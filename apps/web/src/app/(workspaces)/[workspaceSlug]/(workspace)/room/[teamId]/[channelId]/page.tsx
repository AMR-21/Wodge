"use client";

import { MessageList, msgsAtom } from "@/components/room/message-list";
import { RoomHeader } from "@/components/room/room-header";
import { SidebarItemBtn } from "@/components/workspace/sidebar-item-btn";
import { SimpleEditor, useSimpleEditor } from "@repo/editor";
import { Textarea } from "@repo/editor/src/components/ui/Textarea";
import { Input } from "@repo/ui/components/ui/input";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useAtom } from "jotai";
import { Plus, Send, Smile } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect } from "react";

function ChannelPage() {
  const editor = useSimpleEditor();
  const { user } = useCurrentUser();

  const [msgs, setMsgs] = useAtom(msgsAtom);

  function onSubmit() {
    if (editor) {
      const content = editor.storage?.markdown?.getMarkdown();
      if (!content || !user) return;

      setMsgs((msgs) => [
        ...msgs,
        {
          sender: user.id,
          content: content,
          date: new Date().toISOString(),
          id: nanoid(),
        },
      ]);

      editor.commands.clearContent();
    }
  }

  return (
    <div className="flex h-full w-full flex-col justify-end pb-4 pt-2">
      <ScrollArea className="mb-1 pr-2">
        <RoomHeader />
        <MessageList />
      </ScrollArea>
      <div className="flex items-end rounded-md border border-border/50 bg-secondary/40 px-1.5 py-1">
        <SidebarItemBtn Icon={Plus} className="mr-2" />

        <div
          className="flex h-full w-full items-center overflow-hidden"
          onKeyDown={(e) => {
            if (e.code === "Enter" && !e.shiftKey && !e.ctrlKey) {
              onSubmit();
            }
          }}
        >
          <SimpleEditor editor={editor} />
        </div>
        <SidebarItemBtn Icon={Send} className="ml-2" onClick={onSubmit} />
      </div>
    </div>
  );
}

export default ChannelPage;

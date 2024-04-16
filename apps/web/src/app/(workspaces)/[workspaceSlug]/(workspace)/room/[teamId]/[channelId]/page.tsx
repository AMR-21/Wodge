"use client";

import { MessageList } from "@/components/room/message-list";
import { RoomHeader } from "@/components/room/room-header";
import { SidebarItemBtn } from "@/components/workspace/sidebar-item-btn";
import { SimpleEditor, useSimpleEditor } from "@repo/editor";
import { Textarea } from "@repo/editor/src/components/ui/Textarea";
import { Input } from "@repo/ui/components/ui/input";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Plus, Send, Smile } from "lucide-react";
import { useEffect } from "react";

function ChannelPage() {
  const editor = useSimpleEditor();

  function onSubmit() {
    if (editor) {
      console.log(editor.getText());
      editor.commands.clearContent();
    }
  }

  return (
    <div className="h-full w-full p-1.5">
      <div className="flex h-full flex-col justify-end">
        <ScrollArea className="mb-2">
          <RoomHeader />
          <MessageList />
        </ScrollArea>
        <div className="flex items-end rounded-md border border-border/50 bg-secondary/40 px-1.5 py-1">
          <SidebarItemBtn Icon={Plus} className="mr-2" />

          <div
            className="flex h-full w-full items-center overflow-hidden"
            onKeyDown={(e) => {
              if (e.code === "Enter" && !e.shiftKey) {
                onSubmit();
              }
            }}
          >
            <SimpleEditor editor={editor} />
          </div>
          <SidebarItemBtn Icon={Send} className="ml-2" onClick={onSubmit} />
        </div>
      </div>
    </div>
  );
}

export default ChannelPage;

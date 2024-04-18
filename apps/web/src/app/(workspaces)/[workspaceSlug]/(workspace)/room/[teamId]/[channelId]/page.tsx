"use client";

import { MessageList, msgsAtom } from "@/components/room/message-list";
import { RoomHeader } from "@/components/room/room-header";
import { SidebarItemBtn } from "@/components/workspace/sidebar-item-btn";
import { SimpleEditor, useMessageEditor } from "@repo/editor";
import { Textarea } from "@repo/editor/src/components/ui/Textarea";
import { Input } from "@repo/ui/components/ui/input";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useAtom } from "jotai";
import { Plus, Send, Smile } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import XHR from "@uppy/xhr-upload";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

function ChannelPage() {
  const editor = useMessageEditor();
  const { user } = useCurrentUser();
  const [uppy] = useState(() =>
    new Uppy().use(XHR, {
      endpoint: "http://localhost:8787/object/put/testasd/YW1yL3Jlc3VtZS5wZGY=",
    }),
  );
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
    <div className="flex h-full w-full flex-col pb-4 pt-2">
      <Dashboard uppy={uppy} id="dahsboard" />
      <div className="flex-1" />
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

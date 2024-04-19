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
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import { UploadButton } from "@/components/room/upload-button";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

function ChannelPage() {
  const editor = useMessageEditor();
  const { user } = useCurrentUser();
  const { workspaceId } = useCurrentWorkspace();

  const [msgs, setMsgs] = useAtom(msgsAtom);

  function onSubmit() {
    if (editor) {
      // console.log(DOMPurify.sanitize(editor.getHTML()));
      const content = editor.getHTML();
      if (!content || !user) return;

      setMsgs((msgs) => [
        ...msgs,
        {
          sender: user.id,
          content: content,
          date: new Date().toISOString(),
          id: nanoid(),
          type: "text",
        },
      ]);

      editor.commands.clearContent();
    }
  }

  if (!workspaceId) return null;

  return (
    <div className="flex h-full w-full flex-col  pb-4 pt-2">
      {/* <Dashboard uppy={uppy} id="dahsboard" /> */}

      <div className="flex-1" />
      <ScrollArea className="mb-1 flex min-w-0 flex-col pr-2">
        {/* <div className=" overflow-y-auto"> */}
        <RoomHeader />
        <MessageList />
        {/* </div> */}
      </ScrollArea>
      <div className="flex shrink-0 items-end rounded-md border border-border/50 bg-secondary/40 px-1.5 py-1">
        <UploadButton bucketId={workspaceId} />

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

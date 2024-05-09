"use client";

import { RoomHeader } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/room/room-header";
import { SidebarItemBtn } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/_components/sidebar-item-btn";
import { OfflineEditor, useMessageEditor } from "@repo/editor";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useAtom } from "jotai";
import { Send } from "lucide-react";
import { nanoid } from "nanoid";
import "@uppy/core/dist/style.min.css";

import { UploadButton } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/room/upload-button";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useCurrentRoomRep } from "@repo/ui/hooks/use-room-rep";
import { useUpdateRecentlyVisited } from "@repo/ui/hooks/use-recently-visited";
import { useParams } from "next/navigation";
import { MessageList } from "./message-list";
import { useCanEdit } from "@repo/ui/hooks/use-can-edit";

function ChannelPage() {
  useUpdateRecentlyVisited("room");

  const editor = useMessageEditor();
  const { user } = useCurrentUser();
  const { workspaceId } = useCurrentWorkspace();

  const { channelId, teamId } = useParams<{
    channelId: string;
    teamId: string;
  }>();

  const canEdit = useCanEdit({
    type: "room",
  });
  const rep = useCurrentRoomRep();

  async function onSubmit() {
    if (editor) {
      const content = editor.getHTML();
      if (!content || !user) return;

      await rep?.mutate.sendMessage({
        sender: user.id,
        content: content,
        date: new Date().toISOString(),
        id: nanoid(),
        type: "text",
        reactions: [],
      });

      editor.commands.clearContent();
    }
  }

  if (!workspaceId) return null;
  console.log(window?.history.state);

  return (
    <div className="flex h-full w-full flex-col  pb-4 pt-2">
      {/* <Dashboard uppy={uppy} id="dahsboard" /> */}

      <div className="flex-1" />
      <ScrollArea className="mb-1 flex min-w-0 flex-col pr-2">
        {/* <div className=" overflow-y-auto"> */}
        <RoomHeader />
        <MessageList rep={rep} />
        {/* </div> */}
      </ScrollArea>
      <div className="flex shrink-0 items-end rounded-md border border-border/50 bg-secondary/40 px-1.5 py-1">
        {!canEdit && (
          <p className="text-muted-foreground">
            Your are not allowed to send messages in this room.
          </p>
        )}
        {canEdit && (
          <>
            <UploadButton
              workspaceId={workspaceId}
              channelId={channelId}
              teamId={teamId}
              rep={rep}
            />

            <div
              className="flex h-full w-full items-center overflow-hidden"
              onKeyDown={(e) => {
                if (e.code === "Enter" && !e.shiftKey && !e.ctrlKey) {
                  onSubmit();
                }
              }}
            >
              <OfflineEditor editor={editor} />
            </div>
            <SidebarItemBtn Icon={Send} className="ml-2" onClick={onSubmit} />
          </>
        )}
      </div>
    </div>
  );
}

export default ChannelPage;

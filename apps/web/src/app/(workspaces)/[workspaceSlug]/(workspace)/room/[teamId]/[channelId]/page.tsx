"use client";

import { RoomHeader } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/room/room-header";
import { useCurrentRoomRep } from "@/hooks/use-room-rep";
import { useUpdateRecentlyVisited } from "@/hooks/use-recently-visited";
import { MessageList } from "./message-list";
import { MessageEditor } from "./message-editor";

function ChannelPage() {
  useUpdateRecentlyVisited("room");

  const rep = useCurrentRoomRep();

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1" />

      <div className="overflow-y-auto overflow-x-hidden pt-3">
        <div className="space-y-2 px-2 pb-3">
          <RoomHeader />
          <MessageList rep={rep} />
        </div>
      </div>
      <MessageEditor rep={rep} />
    </div>
  );
}

export default ChannelPage;

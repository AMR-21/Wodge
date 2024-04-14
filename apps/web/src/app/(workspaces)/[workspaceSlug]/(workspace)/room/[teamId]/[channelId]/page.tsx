"use client";

import { MessageList } from "@/components/room/message-list";
import { RoomHeader } from "@/components/room/room-header";
import { Textarea } from "@repo/editor/src/components/ui/Textarea";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";

function ChannelPage() {
  return (
    <div className="flex h-full flex-col p-1.5">
      <div className="flex h-full min-h-0 flex-col justify-end ">
        <ScrollArea>
          <RoomHeader />
          <MessageList />
        </ScrollArea>
      </div>
      <div className="shrink-0">
        <Textarea />
      </div>
    </div>
  );
}

export default ChannelPage;

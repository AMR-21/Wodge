"use client";

import { MessageList } from "@/components/room/message-list";
import { RoomHeader } from "@/components/room/room-header";
import { SimpleEditor } from "@repo/editor";
import { Textarea } from "@repo/editor/src/components/ui/Textarea";
import { Input } from "@repo/ui/components/ui/input";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";

function ChannelPage() {
  return (
    <div className="h-full w-full p-1.5">
      <div className="flex h-full flex-col justify-end">
        <ScrollArea>
          <RoomHeader />
          <MessageList />
        </ScrollArea>
        {/* <div className=" bg-secondary/40 px-6 py-2"> */}
        <SimpleEditor />
        {/* </div> */}
      </div>
    </div>
  );
}

export default ChannelPage;

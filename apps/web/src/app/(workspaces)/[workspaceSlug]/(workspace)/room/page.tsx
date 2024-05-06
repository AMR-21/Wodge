"use client";

import { RecentCarousel } from "@/components/home/recent-carousel";
import { Button } from "@repo/ui/components/ui/button";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { Plus } from "lucide-react";

function ChatPage() {
  const { workspace } = useCurrentWorkspace();

  return (
    <div className="container w-full space-y-4">
      <h2 className="text-center text-2xl font-semibold">
        {workspace?.name} Rooms
      </h2>

      <Button variant="secondary" className="w-full gap-1">
        <Plus className="h-4 w-4" />
        New Room
      </Button>
      <RecentCarousel filter="room" />
    </div>
  );
}

export default ChatPage;

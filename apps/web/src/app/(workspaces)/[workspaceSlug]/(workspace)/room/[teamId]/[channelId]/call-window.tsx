"use client";

import { Button } from "@/components/ui/button";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { useChannelPath } from "@/hooks/use-channel-path";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store-provider";
import { isCallWindowOpenAtom, isSidebarOpenAtom } from "@/store/global-atoms";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useAtom, useAtomValue } from "jotai";
import { useParams } from "next/navigation";
import { memo, useEffect, useMemo, useState } from "react";

export const CallWindow = memo(({}) => {
  const room = useAppStore((s) => s.room);
  const roomObj = useMemo(() => room, [room]);
  const [isConnecting, setIsConnecting] = useState(false);
  const { connectToRoom, disconnectFromCurrentRoom } = useAppStore(
    (s) => s.actions,
  );

  const isSidebarOpen = useAtomValue(isSidebarOpenAtom);
  const [isCallWindowOpen, setCallWindow] = useAtom(isCallWindowOpenAtom);

  const { teamId, channelId } = useParams<{
    teamId?: string;
    workspaceSlug: string;
    channelId: string;
  }>();

  const path = useChannelPath();

  const { workspaceId, workspaceSlug, workspace } = useCurrentWorkspace();

  if (!room)
    return (
      <div
        tabIndex={-1}
        className={cn(
          "invisible absolute right-0 top-[3.375rem] z-50 flex h-[calc(100vh-3.375rem)] flex-col items-center justify-center gap-4 bg-background transition-all",
          isSidebarOpen && "w-[calc(100vw-15rem)]",
          !isSidebarOpen && "w-[calc(100vw-0rem)]",
          isCallWindowOpen && "visible",
        )}
        onClick={(e) => e.stopPropagation()}
        suppressHydrationWarning
      >
        <p>Start or join the call to engage with members</p>
        <Button
          size="sm"
          className="w-36"
          onClick={async () => {
            setIsConnecting(true);
            await connectToRoom({
              workspaceId: workspaceId,
              channelId: channelId,
              teamId: teamId,
              channelName: path?.room?.name,
              teamName: path?.team?.name,
              workspaceName: workspace?.name,
              workspaceSlug: workspaceSlug,
            });

            setIsConnecting(false);
          }}
          isPending={isConnecting}
        >
          Connect to room
        </Button>
      </div>
    );

  return (
    <div
      className={cn(
        "invisible absolute right-0 top-[3.375rem] z-50 flex h-[calc(100vh-3.4rem)] flex-col items-center justify-center gap-4 bg-background transition-all",
        isSidebarOpen && "w-[calc(100vw-15rem)]",
        !isSidebarOpen && "w-[calc(100vw-0rem)]",
        isCallWindowOpen && "visible",
      )}
      tabIndex={-1}
    >
      <LiveKitRoom
        token=""
        room={roomObj?.room}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        className=" bg-background"
        onDisconnected={async () => {
          await disconnectFromCurrentRoom();
          if (!path?.room) setCallWindow(false);
        }}
        connect={false}
        
      >
        <VideoConference className="lk-video-conference bg-background" />
      </LiveKitRoom>
    </div>
  );
});

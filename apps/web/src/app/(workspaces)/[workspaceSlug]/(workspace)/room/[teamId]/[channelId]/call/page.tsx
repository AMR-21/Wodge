"use client";

import "@livekit/components-styles";
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  LayoutContext,
  LayoutContextProvider,
  PreJoin,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { env } from "@repo/env";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { useAppState } from "@repo/ui/store/store";
import { Button } from "@repo/ui/components/ui/button";
import { useChannelPath } from "@repo/ui/hooks/use-channel-path";

export default function RoomPage() {
  const room = useAppState((s) => s.room);
  const [isConnecting, setIsConnecting] = useState(false);
  const { connectToRoom, disconnectFromCurrentRoom } = useAppState(
    (s) => s.actions,
  );

  const { teamId, channelId } = useParams<{
    teamId?: string;
    workspaceSlug: string;
    channelId: string;
  }>();

  const path = useChannelPath();

  const { workspaceId } = useCurrentWorkspace();

  if (!room)
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <p>Start or join the call to engage with members</p>
        <Button
          size="sm"
          onClick={async () => {
            setIsConnecting(true);
            await connectToRoom({
              workspaceId: workspaceId,
              channelId: channelId,
              teamId: teamId,
              channelName: path?.room,
            });

            setIsConnecting(false);
          }}
          isPending={isConnecting}
        >
          Connect to room
        </Button>
      </div>
    );

  if (room.id !== channelId)
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <p>Start or join the call to engage with members</p>
        <Button
          size="sm"
          onClick={async () => {
            setIsConnecting(true);
            await disconnectFromCurrentRoom();
            await connectToRoom({
              workspaceId: workspaceId,
              channelId: channelId,
              teamId: teamId,
              channelName: path?.room,
            });

            setIsConnecting(false);
          }}
          isPending={isConnecting}
        >
          Connect to room
        </Button>

        <p className="text-sm text-muted-foreground">
          Connecting to this room will disconnect you from the currently active
          call
        </p>
      </div>
    );

  return (
    <div className="h-full w-full">
      <LiveKitRoom
        token={""}
        room={room.room}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        className="flex w-full flex-col"
        options={{
          disconnectOnPageLeave: false,
        }}
        onDisconnected={async () => {
          console.log("Disconnected from room");
          await disconnectFromCurrentRoom();
        }}
      >
        <VideoConference className="lk-video-conference bg-background" />
      </LiveKitRoom>
    </div>
  );
}

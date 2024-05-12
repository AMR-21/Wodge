"use client";

import "@livekit/components-styles";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { Button } from "@/components/ui/button";
import { useChannelPath } from "@/hooks/use-channel-path";
import { useAppStore } from "@/store/app-store-provider";

export default function RoomPage() {
  const room = useAppStore((s) => s.room);
  const roomObj = useMemo(() => room, [room]);
  const [isConnecting, setIsConnecting] = useState(false);
  const { connectToRoom, disconnectFromCurrentRoom } = useAppStore(
    (s) => s.actions,
  );

  const { teamId, channelId } = useParams<{
    teamId?: string;
    workspaceSlug: string;
    channelId: string;
  }>();

  const { micStatus, camStatus, screenStatus } = useAppStore((s) => s);

  // const dataRef = useMemo(() => {
  //   return { teamId, channelId };
  // }, [room]);

  const path = useChannelPath();

  const { workspaceId } = useCurrentWorkspace();

  // async function connectToRoom({
  //   workspaceId,
  //   channelId,
  //   teamId,
  //   channelName,
  // }: ConnectionParams & {}) {
  //   if (!workspaceId || !channelId || !teamId || !channelName) return;
  //   console.log("Connecting to room");

  //   const room = new Room({
  //     disconnectOnPageLeave: false,
  //   });

  //   const resp = await fetch(
  //     `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/room/${channelId}/call-token`,
  //     {
  //       headers: {
  //         "x-workspace-id": workspaceId,
  //         "x-team-id": teamId,
  //       },
  //       credentials: "include",
  //     },
  //   );
  //   const data = await resp.json<{
  //     token: string;
  //   }>();
  //   await room.connect(env.NEXT_PUBLIC_LIVEKIT_URL, data.token);
  //   room.localParticipant.setMicrophoneEnabled(!!micStatus);
  //   room.localParticipant.setCameraEnabled(!!camStatus);
  //   room.localParticipant.setScreenShareEnabled(!!screenStatus);

  //   return {
  //     room,
  //     name: channelName,
  //     id: channelId,
  //   };
  // }

  if (!room)
    return (
      <div
        className=" flex h-full w-full flex-col items-center justify-center gap-4"
        suppressHydrationWarning
      >
        <p>Start or join the call to engage with members</p>
        <Button
          size="sm"
          onClick={async () => {
            setIsConnecting(true);
            const call = await connectToRoom({
              workspaceId: workspaceId,
              channelId: channelId,
              teamId: teamId,
              channelName: path?.room?.name,
            });

            setIsConnecting(false);
          }}
          isPending={isConnecting}
        >
          Connect to room
        </Button>
      </div>
    );

  // if (roomRef.current.id !== channelId)
  //   return (
  //     <div className=" top-0 flex h-full w-full flex-col items-center justify-center gap-4">
  //       <p>Start or join the call to engage with members</p>
  //       <Button
  //         size="sm"
  //         onClick={async () => {
  //           setIsConnecting(true);
  //           // await disconnectFromCurrentRoom();
  //           await connectToRoom({
  //             workspaceId: workspaceId,
  //             channelId: channelId,
  //             teamId: teamId,
  //             channelName: path?.room?.name,
  //           });

  //           setIsConnecting(false);
  //         }}
  //         isPending={isConnecting}
  //       >
  //         Connect to room
  //       </Button>

  //       <p className="text-sm text-muted-foreground">
  //         Connecting to this room will disconnect you from the currently active
  //         call
  //       </p>
  //     </div>
  //   );

  if (!roomObj) return null;
  return (
    <div className=" top-0 h-full w-full">
      <LiveKitRoom
        token=""
        room={roomObj.room}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        className="flex w-full flex-col"
        onDisconnected={async () => {
          await disconnectFromCurrentRoom();
        }}
        connect={false}
      >
        <VideoConference className="lk-video-conference bg-background" />
      </LiveKitRoom>
    </div>
  );
}

"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { useChannelPath } from "@/hooks/use-channel-path";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { isCallWindowOpenAtom, isSidebarOpenAtom } from "@/store/global-atoms";
import {
  ControlBar,
  FocusLayout,
  LiveKitRoom,
  MediaDeviceMenu,
  PreJoin,
  useCreateLayoutContext,
  useDisconnectButton,
  useLocalParticipantPermissions,
  usePinnedTracks,
  VideoConference as VideoConf,
} from "@livekit/components-react";
import { useAtom, useAtomValue } from "jotai";
import { useParams } from "next/navigation";
import { memo, use, useCallback, useEffect, useMemo, useState } from "react";
import { VideoConference } from "./video-conference";
import {
  camDeviceAtom,
  camStatusAtom,
  isCarouselOpenAtom,
  isFullScreenAtom,
  micDeviceAtom,
  micStatusAtom,
  roomAtom,
  screenStatusAtom,
} from "./atoms";
import { connectToRoom } from "./connect-to-room";
import { disconnectFromRoom } from "./disconnect-from-room";
import { Room, Track } from "livekit-client";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  LogOut,
  Maximize,
  Mic,
  MicOff,
  Minimize,
  PhoneOff,
  ScreenShare,
  ScreenShareOff,
  Users2,
  Video,
  VideoOff,
} from "lucide-react";
import { supportsScreenSharing } from "@livekit/components-core";
import { TrackToggle } from "./track-toggle";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MediaDeviceList } from "./media-device-list";

export const CallWindow = memo(({}) => {
  // const room = useAppStore((s) => s.room);

  const room = useAtomValue(roomAtom);
  // const roomObj = useMemo(() => room, [room]);
  const [isConnecting, setIsConnecting] = useState(false);

  const isSidebarOpen = useAtomValue(isSidebarOpenAtom);
  const [isCallWindowOpen, setCallWindow] = useAtom(isCallWindowOpenAtom);

  const { teamId, channelId } = useParams<{
    teamId?: string;
    workspaceSlug: string;
    channelId: string;
  }>();

  const path = useChannelPath();

  const { workspaceId, workspaceSlug, workspace } = useCurrentWorkspace();
  const [isFullScreen, setFullScreen] = useAtom(isFullScreenAtom);
  useEffect(() => {
    function toggle() {
      console.log("fullscreen change");
      setFullScreen(!!document.fullscreenElement);
    }
    document.documentElement.addEventListener("fullscreenchange", toggle);

    return () =>
      document.documentElement.removeEventListener("fullscreenchange", toggle);
  }, []);

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
        "invisible absolute right-0 top-[3.375rem] z-40 flex h-[calc(100vh-3.4rem)] flex-col items-center justify-center gap-4 bg-background  transition-all",
        isSidebarOpen && "w-[calc(100vw-15rem)]",
        !isSidebarOpen && "w-[calc(100vw-0rem)]",
        isCallWindowOpen && "visible",
        isFullScreen && "top-0 h-full w-full",
      )}
      tabIndex={-1}
    >
      <LiveKitRoom
        token=""
        room={room?.room}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        className="group/call relative flex h-full flex-col bg-background"
        onDisconnected={async () => {
          await disconnectFromRoom();
          if (!path?.room) setCallWindow(false);
        }}
        connect={false}
      >
        <VideoConference className="flex-1" />

        <div className="absolute bottom-0 w-full shrink-0 translate-y-0 transition-all group-hover/call:translate-y-0">
          <ControlBtns />
        </div>
      </LiveKitRoom>
    </div>
  );
});

function ControlBtns() {
  const browserSupportsScreenSharing = supportsScreenSharing();

  const [screenStatus, setScreenStatus] = useAtom(screenStatusAtom);
  const [micStatus, setMicStatus] = useAtom(micStatusAtom);
  const [camStatus, setCamStatus] = useAtom(camStatusAtom);
  const [isFullScreen, setFullScreen] = useAtom(isFullScreenAtom);

  const [micDevice, setMicDevice] = useAtom(micDeviceAtom);
  const [camDevice, setCamDevice] = useAtom(camDeviceAtom);

  const { buttonProps } = useDisconnectButton({
    className: "rounded-full p-3",
  });
  const [isCarouselOpen, setIsCarouselOpen] = useAtom(isCarouselOpenAtom);

  return (
    <div className="flex shrink-0 items-center gap-2 bg-transparent px-3 py-4 shadow-lg">
      <div className="ml-auto">
        <Button
          variant="secondary"
          size="fit"
          className="gap-1 rounded-full p-3.5"
          onClick={() => {
            setIsCarouselOpen(!isCarouselOpen);
          }}
        >
          <ChevronLeft
            className={cn(
              "size-5 transition-all",
              isCarouselOpen && "rotate-180",
            )}
          />
          <Users2 className="size-5" />
        </Button>
      </div>
      <div className="relative ">
        <TrackToggle source={Track.Source.Microphone} onChange={setMicStatus}>
          {micStatus ? (
            <Mic className="size-5" />
          ) : (
            <MicOff className="size-5" />
          )}
        </TrackToggle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "absolute -right-1 -top-1 h-fit rounded-full border-2 border-background p-0.5",
              )}
              role="button"
            >
              <ChevronUp className="size-3.5" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top">
            <MediaDeviceList
              initialSelection={micDevice}
              kind="audioinput"
              onActiveDeviceChange={(d) => {
                setMicDevice(d);
              }}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative">
        <TrackToggle source={Track.Source.Camera} onChange={setCamStatus}>
          {camStatus ? (
            <Video className="size-5" />
          ) : (
            <VideoOff className="size-5" />
          )}
        </TrackToggle>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "absolute -right-1 -top-1 h-fit rounded-full border-2 border-background p-0.5",
              )}
              role="button"
            >
              <ChevronUp className="size-3.5" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit" side="top">
            <MediaDeviceList
              initialSelection={camDevice}
              kind="videoinput"
              onActiveDeviceChange={(d) => {
                setCamDevice(d);
              }}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {browserSupportsScreenSharing && (
        <div>
          <TrackToggle
            source={Track.Source.ScreenShare}
            captureOptions={{
              audio: true,
              selfBrowserSurface: "include",
            }}
            onChange={setScreenStatus}
          >
            {screenStatus ? (
              <ScreenShareOff className="size-5" />
            ) : (
              <ScreenShare className="size-5" />
            )}
          </TrackToggle>
        </div>
      )}

      <div className="-mr-[3.25rem]">
        <Button variant="destructive" size="fit" {...buttonProps}>
          <PhoneOff className="size-5" />
        </Button>
      </div>

      <div className="ml-auto">
        <Button
          variant="secondary"
          size="fit"
          className="rounded-full p-3"
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              if (document.exitFullscreen) {
                document.exitFullscreen();
              }
            }
          }}
        >
          {isFullScreen ? (
            <Minimize className="size-5" />
          ) : (
            <Maximize className="size-5" />
          )}
        </Button>
      </div>
    </div>
  );
}

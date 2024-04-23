"use client";
import { SidebarItemBtn } from "./sidebar-item-btn";
import {
  Camera,
  Headset,
  Mic,
  MonitorUp,
  PanelLeft,
  PhoneCall,
} from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { useAtom } from "jotai";
import { isSidebarOpenAtom } from "@repo/ui/store/atoms";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@repo/ui/components/ui/breadcrumb";
import { useParams } from "next/navigation";
import { useChannelPath } from "@repo/ui/hooks/use-channel-path";
import { useAppState } from "@repo/ui/store/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { Button } from "@repo/ui/components/ui/button";
import { Toggle } from "@repo/ui/components/ui/toggle";
import Link from "next/link";
import { useState } from "react";
import { set } from "lodash";

export function AppHeader() {
  const [isSidebarOpen, setSidebar] = useAtom(isSidebarOpenAtom);

  const { teamId, workspaceSlug } = useParams<{
    teamId?: string;
    workspaceSlug: string;
  }>();

  const { workspaceId } = useCurrentWorkspace();
  const path = useChannelPath();

  const lk_room = useAppState((s) => s.room);

  const {
    connectToRoom,
    disconnectFromCurrentRoom,
    toggleCam,
    toggleMic,
    toggleScreen,
  } = useAppState((s) => s.actions);

  const [isConnecting, setIsConnecting] = useState(false);

  const micStatus = useAppState((s) => s.micStatus);
  const camStatus = useAppState((s) => s.camStatus);
  const screenStatus = useAppState((s) => s.screenStatus);

  const openSidebar = setSidebar.bind(null, true);

  return (
    <div
      className={
        "flex h-12 w-full items-center bg-background px-2.5 py-2 transition-all"
      }
    >
      <div className="flex basis-full items-center px-1.5 py-2.5">
        {!isSidebarOpen && (
          <SidebarItemBtn
            Icon={PanelLeft}
            className={cn(
              "pointer-events-auto mr-3 transition-all duration-500",
            )}
            onClick={(e) => {
              e.stopPropagation();
              openSidebar();
            }}
          />
        )}
        {teamId && (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>{path?.team}</BreadcrumbItem>
              {(path?.page || path?.room || path?.thread) && (
                <BreadcrumbSeparator />
              )}
              {path?.folder && !path?.folderId?.startsWith("root-") && (
                <>
                  <BreadcrumbItem>{path?.folder}</BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              {path?.page && <BreadcrumbItem>{path?.page}</BreadcrumbItem>}
              {path?.room && <BreadcrumbItem>{path?.room}</BreadcrumbItem>}
              {path?.thread && <BreadcrumbItem>{path?.thread}</BreadcrumbItem>}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {path?.room && (
          <SidebarItemBtn
            iconClassName={cn("h-5 w-5")}
            Icon={Headset}
            href={`/${workspaceSlug}/room/${teamId}/${path?.roomId}/call`}
            className="ml-auto mr-2"
          />
        )}
        <Popover>
          <PopoverTrigger asChild>
            <SidebarItemBtn
              iconClassName={cn("h-5 w-5", lk_room && "text-green-500")}
              Icon={PhoneCall}
              className={cn(
                "mr-6",
                !path?.room && "ml-auto",
                lk_room && "animate-pulse duration-1000 hover:animate-none",
              )}
            />
          </PopoverTrigger>

          <PopoverContent align="end" alignOffset={0} className="space-y-3">
            {!lk_room && (
              <p className="text-center text-muted-foreground">
                No active call
              </p>
            )}

            {lk_room && (
              <div className="flex items-center justify-center text-center text-sm">
                <Link
                  href={`/${workspaceSlug}/room/${teamId}/${lk_room?.id}/call`}
                >
                  <Button
                    className="hover:text-sky-500"
                    size="sm"
                    variant="link"
                  >
                    Jump to call @
                    <span className="max-w-28  truncate">{lk_room?.name}</span>
                  </Button>
                </Link>
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <Button
                size="sm"
                onClick={async () => {
                  setIsConnecting(true);
                  lk_room
                    ? await disconnectFromCurrentRoom()
                    : await connectToRoom({
                        workspaceId: workspaceId,
                        channelId: path?.roomId,
                        teamId: teamId,
                        channelName: path?.room,
                      });

                  setIsConnecting(false);
                }}
                disabled={!lk_room && !path?.roomId}
                className="w-full"
                isPending={isConnecting}
              >
                {lk_room ? "Disconnect" : "Connect to room"}
              </Button>
              <div className="flex gap-1">
                <Toggle
                  variant="outline"
                  size="sm"
                  className="group"
                  pressed={micStatus}
                  onPressedChange={() => {
                    toggleMic();
                  }}
                >
                  <Mic className="size-4 group-data-[state=off]:text-red-500 " />
                </Toggle>

                <Toggle
                  variant="outline"
                  size="sm"
                  className="group"
                  pressed={camStatus}
                  onPressedChange={() => {
                    toggleCam();
                  }}
                >
                  <Camera className="size-4 group-data-[state=off]:text-red-500 " />
                </Toggle>

                <Toggle
                  variant="outline"
                  size="sm"
                  className="group"
                  pressed={screenStatus}
                  onPressedChange={() => {
                    toggleScreen();
                  }}
                >
                  <MonitorUp className="size-4 group-data-[state=off]:text-red-500 " />
                </Toggle>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

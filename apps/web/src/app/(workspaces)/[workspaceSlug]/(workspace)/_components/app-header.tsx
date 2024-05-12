"use client";
import { SidebarItemBtn } from "./sidebar-item-btn";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Headset,
  Mic,
  MonitorUp,
  PanelLeft,
  PhoneCall,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAtom, useSetAtom } from "jotai";
import { isCallWindowOpenAtom, isSidebarOpenAtom } from "@/store/global-atoms";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { useChannelPath } from "@/hooks/use-channel-path";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import RoomPage from "../room/[teamId]/[channelId]/call/page";
import { useAppStore } from "@/store/app-store-provider";

export function AppHeader() {
  const [isSidebarOpen, setSidebar] = useAtom(isSidebarOpenAtom);

  const { teamId, workspaceSlug } = useParams<{
    teamId?: string;
    workspaceSlug: string;
  }>();

  const { workspaceId, workspace } = useCurrentWorkspace();
  const path = useChannelPath();

  const lk_room = useAppStore((s) => s.room);

  const router = useRouter();

  const {
    connectToRoom,
    disconnectFromCurrentRoom,
    toggleCam,
    toggleMic,
    toggleScreen,
  } = useAppStore((s) => s.actions);

  const [isConnecting, setIsConnecting] = useState(false);

  const micStatus = useAppStore((s) => s.micStatus);
  const camStatus = useAppStore((s) => s.camStatus);
  const screenStatus = useAppStore((s) => s.screenStatus);

  const openSidebar = setSidebar.bind(null, true);

  const setCallWindow = useSetAtom(isCallWindowOpenAtom);

  return (
    <div
      className={
        "mt-1.5 flex h-12 w-full items-center border-b border-border/80 bg-dim py-2.5 pl-2 pr-4  transition-all"
      }
    >
      <div className="flex w-full items-center">
        {!isSidebarOpen && (
          <SidebarItemBtn
            Icon={PanelLeft}
            className={cn(
              "pointer-events-auto mr-0.5 transition-all duration-500",
            )}
            onClick={(e) => {
              e.stopPropagation();
              openSidebar();
            }}
          />
        )}

        <SidebarItemBtn
          onClick={() => router.back()}
          Icon={ArrowLeft}
          className="mr-0.5"
        />
        <SidebarItemBtn
          onClick={() => router.forward()}
          Icon={ArrowRight}
          className="mr-2"
        />

        {teamId && (
          <Breadcrumb className="overflow-hidden">
            <BreadcrumbList>
              <BreadcrumbItem>{path?.team.name}</BreadcrumbItem>
              {(path?.page || path?.room) && <BreadcrumbSeparator />}
              {path?.folder && !path?.folder.id?.startsWith("root-") && (
                <>
                  <BreadcrumbItem>{path?.folder.name}</BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              {path?.page && <BreadcrumbItem>{path?.page.name}</BreadcrumbItem>}
              {path?.room && <BreadcrumbItem>{path?.room.name}</BreadcrumbItem>}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        <SidebarItemBtn
          iconClassName={cn(
            "h-5 w-5",
            lk_room && "text-green-600 dark:text-green-500",
          )}
          Icon={PhoneCall}
          className={cn(
            "invisible ml-auto",
            path?.room && "visible",
            lk_room && "animate-pulse duration-1000 hover:animate-none",
          )}
          onClick={() => {
            setCallWindow((c) => !c);
          }}
        />
      </div>
    </div>
  );
}

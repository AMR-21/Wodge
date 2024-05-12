"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { Sidebar } from "./sidebar";
import { SidebarHeader } from "./sidebar-header";
import { isCallWindowOpenAtom, isSidebarOpenAtom } from "@/store/global-atoms";
import { cn } from "@/lib/utils";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SafeAvatar } from "@/components/safe-avatar";
import { useAppStore } from "@/store/app-store-provider";
import { Toggle } from "@/components/ui/toggle";
import {
  Camera,
  Mic,
  MonitorUp,
  PhoneCall,
  PhoneOff,
  Settings,
  Settings2,
} from "lucide-react";
import { SidebarItemBtn } from "./sidebar-item-btn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Fragment } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  useConnectionQualityIndicator,
  useConnectionState,
} from "@livekit/components-react";
import Link from "next/link";
import { CallCard } from "./call-card";
import { UserCard } from "./user-card";

export function SidebarWrapper() {
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom);
  const { room } = useAppStore((s) => s);

  return (
    <div
      className={cn(
        "flex w-60 max-w-60 shrink-0 flex-col border-r border-border/50 bg-dim  pt-1.5 transition-all",
        !isSidebarOpen && "w-0",
      )}
    >
      <SidebarHeader />

      <Sidebar />

      {room && <CallCard />}

      <UserCard />
    </div>
  );
}

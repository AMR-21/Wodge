"use client";

import { useAtomValue } from "jotai";
import { Sidebar } from "./sidebar";
import { SidebarHeader } from "./sidebar-header";
import { isSidebarOpenAtom } from "@/store/global-atoms";
import { cn } from "@/lib/utils";
import { CallCard } from "./call-card";
import { UserCard } from "./user-card";
import { roomAtom } from "../room/[teamId]/[channelId]/atoms";

export function SidebarWrapper() {
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom);
  const room = useAtomValue(roomAtom);

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

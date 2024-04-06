"use client";

import { useAtomValue } from "jotai";
import { Sidebar } from "./sidebar";
import { SidebarHeader } from "./sidebar-header";
import { isSidebarOpenAtom } from "@repo/ui/store/atoms";
import { cn } from "@repo/ui/lib/utils";
import { useIsDesktop } from "@repo/ui/hooks/use-is-desktop";

export function SidebarWrapper() {
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom);

  return (
    <div
      className={cn(
        "bg-dim flex w-60 max-w-60 shrink-0 flex-col border-r border-border/50 py-2.5 transition-all",
        !isSidebarOpen && "w-0",
      )}
    >
      <SidebarHeader />

      <Sidebar />
    </div>
  );
}

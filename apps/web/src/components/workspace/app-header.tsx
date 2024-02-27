"use client";

import { useAppState } from "@/store";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarItemBtn } from "./sidebar-item-btn";
import { PanelLeft } from "lucide-react";
import { cn } from "@repo/ui";
import { useSubscribe } from "replicache-react";

export function AppHeader() {
  const isSidebarOpen = useAppState((state) => state.isSidebarOpen);
  const toggleSidebar = useAppState((state) => state.toggleSidebar);
  useSubscribe;

  return (
    <div
      className={
        "flex h-12 min-h-12 items-center border-b border-border/50 transition-all "
      }
    >
      <WorkspaceSwitcher />

      <div className="flex basis-full items-center px-1.5">
        {!isSidebarOpen && (
          <SidebarItemBtn
            Icon={PanelLeft}
            className={cn(
              "pointer-events-auto mr-3 transition-all duration-500",
            )}
            onClick={(e) => {
              e.stopPropagation();
              toggleSidebar();
            }}
          />
        )}
        <p>channel</p>
      </div>
    </div>
  );
}

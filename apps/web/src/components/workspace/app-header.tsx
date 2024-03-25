"use client";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarItemBtn } from "./sidebar-item-btn";
import { PanelLeft } from "lucide-react";
import { useSubscribe } from "replicache-react";
import { useAppState } from "@repo/ui/store/store";
import { cn } from "@repo/ui/lib/utils";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

export function AppHeader() {
  const isSidebarOpen = useAppState((state) => state.isSidebarOpen);
  const toggleSidebar = useAppState((state) => state.actions.toggleSidebar);

  const { workspace } = useCurrentWorkspace();

  return (
    <div
      className={"flex items-center border-b border-border/50  transition-all "}
    >
      <div className="flex h-full w-64 min-w-64 items-center truncate border-r border-border/50 px-1.5 py-2.5">
        <WorkspaceSwitcher />
      </div>

      <div className="flex basis-full items-center px-1.5 py-2.5">
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

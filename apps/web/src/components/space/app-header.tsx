"use client";

import { useStore } from "@/store";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarItemBtn } from "./sidebar-item-btn";
import { PanelLeft } from "lucide-react";

export function AppHeader() {
  const isSidebarOpen = useStore((state) => state.isSidebarOpen);
  const toggleSidebar = useStore((state) => state.toggleSidebar);

  return (
    <div className="flex h-12 min-h-12 items-center border-b border-border/50">
      {isSidebarOpen && <WorkspaceSwitcher />}

      <div className="flex basis-full items-center px-1.5">
        {!isSidebarOpen && (
          <SidebarItemBtn
            Icon={PanelLeft}
            className="pointer-events-auto mr-3"
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

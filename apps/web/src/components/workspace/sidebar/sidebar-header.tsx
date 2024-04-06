"use client";

import { PanelLeftClose, Plus, Search } from "lucide-react";
import { SidebarItemBtn } from "../sidebar-item-btn";
import { WorkspaceSwitcher } from "../workspace-switcher";
import { useAtom, useSetAtom } from "jotai";
import { isSidebarOpenAtom } from "@repo/ui/store/atoms";
import { cn } from "@repo/ui/lib/utils";

export function SidebarHeader() {
  const [isSidebarOpen, setSidebar] = useAtom(isSidebarOpenAtom);
  const closeSidebar = setSidebar.bind(null, false);

  return (
    <div
      className={cn(
        "bg-dim flex h-12 max-h-12 w-full shrink-0 items-center truncate px-2 py-2.5",
        !isSidebarOpen && "px-0",
      )}
    >
      <WorkspaceSwitcher />

      <div className="ml-auto flex items-center gap-1">
        <SidebarItemBtn Icon={Search} />
        <SidebarItemBtn Icon={Plus} className="bg-secondary" />
        <SidebarItemBtn Icon={PanelLeftClose} onClick={closeSidebar} />
      </div>
    </div>
  );
}

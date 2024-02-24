"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  buttonVariants,
  cn,
} from "@repo/ui";
import { ChevronsUpDown, PanelLeft } from "lucide-react";
import { SidebarItemBtn } from "./sidebar-item-btn";
import { useAppState } from "@/store";

export function WorkspaceSwitcher() {
  const toggleSidebar = useAppState((state) => state.toggleSidebar);
  const isSidebarOpen = useAppState((state) => state.isSidebarOpen);

  return (
    <div
      className={cn(
        " flex h-12 w-56 max-w-56 shrink-0 grow-0  overflow-hidden border-r border-border/50  p-1.5 transition-all",
        // w-10 is for 4 icon + 2 padding inset of icon btn + 3 padding of switcher
        !isSidebarOpen && "invisible w-0 border-none",
      )}
    >
      <div
        tabIndex={0}
        className={cn(
          buttonVariants({ variant: "ghost", size: "fit" }),
          "group w-full justify-start",
        )}
        role="button"
      >
        <Avatar className="mr-2 h-6 w-6 text-xs">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>AY</AvatarFallback>
        </Avatar>
        <span className="mr-1 truncate text-sm">Graduation Project</span>
        <ChevronsUpDown className="mr-4 h-3.5 min-h-3.5 w-3.5 min-w-3.5 opacity-60 group-hover:opacity-100" />

        <SidebarItemBtn
          Icon={PanelLeft}
          className="pointer-events-auto ml-auto"
          onClick={(e) => {
            e.stopPropagation();
            toggleSidebar();
          }}
        />
      </div>
    </div>
  );
}

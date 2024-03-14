"use client";

import { ChevronsUpDown, PanelLeft } from "lucide-react";
import { SidebarItemBtn } from "./sidebar-item-btn";
import { useParams } from "next/navigation";
import { useCurrentWorkspaceId } from "@repo/ui/hooks/use-current-workspace-id";
import { useAppState } from "@repo/ui/store/store";
import { buttonVariants } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

export function WorkspaceSwitcher() {
  const toggleSidebar = useAppState((state) => state.actions.toggleSidebar);
  const isSidebarOpen = useAppState((state) => state.isSidebarOpen);

  const { workspace } = useCurrentWorkspace();

  return (
    <div
      className={cn(
        " flex h-12 w-56 max-w-56 shrink-0 grow-0  overflow-hidden border-r border-border/50  p-1.5 transition-all",
        // w-10 is for 4 icon + 2 padding inset of icon btn + 3 padding of switcher
        !isSidebarOpen && " invisible w-0 -translate-x-full border-none",
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
        <Avatar className="mr-2 h-6 w-6 rounded-md text-xs">
          {/* <AvatarImage src={workspace?.avatar} /> */}
          <AvatarFallback className=" rounded-md text-base uppercase">
            {workspace?.name[0]}
          </AvatarFallback>
        </Avatar>
        <span className="mr-1 truncate text-sm">{workspace?.name}</span>
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

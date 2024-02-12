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
import { useStore } from "@/store";

export function SpaceSwitcher() {
  const toggleSidebar = useStore((state) => state.toggleSidebar);
  const isSidebarOpen = useStore((state) => state.isSidebarOpen);

  return (
    <div
      className={cn(
        " w-52  max-w-52 shrink-0 grow-0  overflow-hidden border-r border-border/50 p-1.5 transition-all",
        !isSidebarOpen && "w-10 border-none",
      )}
    >
      <div
        className={cn(
          buttonVariants({ variant: "ghost", size: "fit" }),
          "group w-full justify-start",
          !isSidebarOpen &&
            "pointer-events-none justify-center !bg-transparent",
        )}
        role="button"
      >
        {isSidebarOpen && (
          <>
            <Avatar className="mr-2 h-7 w-7 text-xs">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AY</AvatarFallback>
            </Avatar>
            <span className="mr-1 truncate text-base">Wodge</span>
            <ChevronsUpDown className="mr-4 h-3.5 min-h-3.5 w-3.5 min-w-3.5 opacity-60 group-hover:opacity-100" />
          </>
        )}

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

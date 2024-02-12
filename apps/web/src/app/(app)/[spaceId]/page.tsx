"use client";

import { AppHeader } from "@/components/space/app-header";
import { SidebarItem } from "@/components/space/sidebar-item";
import { useStore } from "@/store";
import { cn } from "@repo/ui";

function SpacePage() {
  const isSidebarOpen = useStore((state) => state.isSidebarOpen);
  return (
    <div className="grid min-h-screen  grid-rows-[auto_1fr] bg-background">
      <AppHeader />
      <div className="flex ">
        <div
          className={cn(
            "  shrink-0 grow-0  bg-green-500 transition-all",
            isSidebarOpen && "w-52 max-w-52 border-r border-border/50 p-1.5  ",
            !isSidebarOpen && "w-0 overflow-hidden",
          )}
        >
          xxx
          {/* <SidebarItem /> */}
        </div>
        <div className="basis-full bg-page px-2">content</div>
      </div>
    </div>
  );
}

export default SpacePage;

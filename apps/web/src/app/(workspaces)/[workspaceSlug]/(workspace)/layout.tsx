"use client";

import { AppHeader } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/_components/app-header";
import { SidebarWrapper } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/_components/sidebar-wrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { cn } from "@/lib/utils";
import { isSidebarOpenAtom } from "@/store/global-atoms";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";

function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop();
  const [isSidebarOpen, setSidebarOpen] = useAtom(isSidebarOpenAtom);

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  return (
    <div className="flex h-dvh w-full ">
      <SidebarWrapper />

      <div className="flex h-full w-full flex-col  ">
        <AppHeader />
        <div
          className={cn(
            "w-[calc(100vw-15rem)] flex-1 overflow-y-auto transition-all",
            !isSidebarOpen && "w-[calc(100vw-0rem)]",
            isSidebarOpen && "w-[calc(100vw-15rem)]",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default WorkspaceLayout;

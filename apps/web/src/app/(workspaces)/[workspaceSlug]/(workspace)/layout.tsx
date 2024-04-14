"use client";

import { AppHeader } from "@/components/workspace/app-header";
import { SidebarWrapper } from "@/components/workspace/sidebar/sidebar-wrapper";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { useIsDesktop } from "@repo/ui/hooks/use-is-desktop";
import { isSidebarOpenAtom } from "@repo/ui/store/atoms";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop();
  const setSidebarOpen = useSetAtom(isSidebarOpenAtom);

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <SidebarWrapper />

      <div className="flex w-full flex-col px-3 py-2.5">
        <AppHeader />
        <div className="container flex h-full max-w-lg sm:max-w-xl lg:max-w-2xl xl:max-w-4xl">
          {children}
        </div>
      </div>
    </div>
  );
}

export default WorkspaceLayout;

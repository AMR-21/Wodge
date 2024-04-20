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
    <div className="flex h-dvh w-full ">
      <SidebarWrapper />

      <div className="flex h-full w-full flex-col py-2.5">
        <AppHeader />
        <div className="lg:max-w-32xl container flex max-w-xl flex-1  overflow-y-hidden sm:max-w-2xl xl:max-w-5xl">
          {children}
        </div>
      </div>
    </div>
  );
}

export default WorkspaceLayout;

"use client";

import { AppHeader } from "@/components/workspace/app-header";
import { SidebarWrapper } from "@/components/workspace/sidebar/sidebar-wrapper";
import { useIsDesktop } from "@repo/ui/hooks/use-is-desktop";
import { isSidebarOpenAtom } from "@repo/ui/store/atoms";
import { useSetAtom } from "jotai";
import { set } from "lodash";
import { useEffect } from "react";

function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop();
  const setSidebarOpen = useSetAtom(isSidebarOpenAtom);

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  return (
    <div className="flex h-dvh max-h-dvh overflow-hidden">
      <SidebarWrapper />

      <div className="flex w-full flex-col py-2.5">
        <AppHeader />
        {children}
      </div>
    </div>
  );
}

export default WorkspaceLayout;

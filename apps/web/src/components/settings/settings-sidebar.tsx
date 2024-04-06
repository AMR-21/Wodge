"use client";

import { cn } from "@repo/ui/lib/utils";
import { SidebarItemBtn } from "../workspace/sidebar-item-btn";
import { Building2, PanelLeft } from "lucide-react";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import {
  SettingsSidebarCollapsibleItem,
  SettingsSidebarHeader,
  SettingsSidebarItem,
  SettingsSidebarList,
} from "./settings";
import { GroupsSidebar } from "./groups/groups-sidebar";
import { TeamsSidebar } from "./teams/teams-sidebar";
import { useIsDesktop } from "@repo/ui/hooks/use-is-desktop";
import { Sheet, SheetContent } from "@repo/ui/components/ui/sheet";

export function SettingsSidebar() {
  const isDesktop = useIsDesktop();

  const jsx = (
    <>
      <div className="flex justify-between pb-6 text-muted-foreground">
        <h2>Settings</h2>
      </div>
      <ScrollArea>
        <div>
          <SettingsSidebarHeader>
            <Building2 className="h-4 w-4" />
            <span>Workspace</span>
          </SettingsSidebarHeader>
          <SettingsSidebarList>
            <SettingsSidebarItem label="general" href="/" isDefault />
            <SettingsSidebarItem label="members" />
            <SettingsSidebarCollapsibleItem label="groups">
              <GroupsSidebar />
            </SettingsSidebarCollapsibleItem>
            <SettingsSidebarCollapsibleItem label="teams">
              <TeamsSidebar />
            </SettingsSidebarCollapsibleItem>
            <SettingsSidebarItem label="upgrade" />
          </SettingsSidebarList>
        </div>
      </ScrollArea>
    </>
  );

  if (isDesktop)
    return (
      <div
        className={cn(
          "bg-dim flex h-dvh w-56 shrink-0 grow flex-col border-r border-border/50 px-6 py-10 transition-all",
        )}
      >
        {jsx}
      </div>
    );

  return (
    <SheetContent side="left" className="bg-dim w-56 py-10">
      {jsx}
    </SheetContent>
  );
}

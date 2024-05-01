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
import { useIsOwnerOrAdmin } from "@repo/ui/hooks/use-is-owner-or-admin";

export function SettingsSidebar() {
  const isDesktop = useIsDesktop();
  const isManger = useIsOwnerOrAdmin();

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
            {isManger && (
              <>
                <SettingsSidebarItem label="members" />

                <SettingsSidebarCollapsibleItem label="groups">
                  <GroupsSidebar />
                </SettingsSidebarCollapsibleItem>
                <SettingsSidebarCollapsibleItem label="teams">
                  <TeamsSidebar />
                </SettingsSidebarCollapsibleItem>

                <SettingsSidebarItem label="upgrade" />
              </>
            )}
          </SettingsSidebarList>
        </div>
      </ScrollArea>
    </>
  );

  if (isDesktop)
    return (
      <div
        className={cn(
          "flex h-dvh w-56 shrink-0 grow flex-col border-r border-border/50 bg-dim px-6 py-10 transition-all",
        )}
      >
        {jsx}
      </div>
    );

  return (
    <SheetContent side="left" className="w-56 bg-dim py-10">
      {jsx}
    </SheetContent>
  );
}

"use client";

import { cn } from "@repo/ui/lib/utils";
import { usePathname } from "next/navigation";
import {
  Database,
  Home,
  LucideIcon,
  MessageCircle,
  Newspaper,
  NotebookText,
  Settings,
} from "lucide-react";
import { SidebarItem } from "../sidebar-item";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { useAtomValue } from "jotai";
import { isSidebarOpenAtom } from "@repo/ui/store/atoms";
import { Teamspaces } from "./teamspaces";
import { ChannelsTypes } from "@repo/data";
import { useIsOwnerOrAdmin } from "@repo/ui/hooks/use-is-owner-or-admin";

interface Tab {
  Icon: LucideIcon;
  label: string;
  href?: string;
}

const tabs: Tab[] = [
  {
    Icon: Home,
    label: "home",
    href: "/",
  },
  {
    Icon: NotebookText,
    label: "pages",
    href: "/page",
  },
  {
    Icon: MessageCircle,
    label: "rooms",
    href: "/room",
  },
  {
    Icon: Newspaper,
    label: "threads",
    href: "/thread",
  },
  {
    Icon: Database,
    label: "resources",
    href: "/resources",
  },
  {
    Icon: Settings,
    label: "settings",
    href: "/settings",
  },
];

export function Sidebar() {
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom);
  const activeChan = usePathname().split("/").at(2) as ChannelsTypes;
  const { workspaceSlug } = useCurrentWorkspace();

  return (
    <ScrollArea>
      <aside
        className={cn(
          "h-full max-h-full min-h-0 shrink-0 grow bg-dim  px-2.5 py-1.5 transition-all",
          !isSidebarOpen && "px-0",
        )}
      >
        <div className="flex flex-col gap-4">
          <ul className="flex flex-col gap-1">
            {tabs.map((tab) => {
              const baseUrl = `/${workspaceSlug}`;

              return (
                <SidebarItem
                  key={tab.label}
                  Icon={tab.Icon}
                  className="capitalize"
                  isActive={
                    activeChan === tab.href?.slice(1) ||
                    (!activeChan && tab.label === "home")
                  }
                  {...(tab.href && { href: baseUrl + tab.href })}
                >
                  {tab.label}
                </SidebarItem>
              );
            })}
          </ul>

          {activeChan ? (
            <Teamspaces type={activeChan} isPages={activeChan === "page"} />
          ) : (
            <Teamspaces type="page" isPages />
          )}
        </div>
      </aside>
    </ScrollArea>
  );
}

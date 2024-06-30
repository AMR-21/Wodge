"use client";

import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import {
  Database,
  Home,
  LucideIcon,
  MessageCircle,
  Newspaper,
  NotebookText,
  Settings,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAtom, useAtomValue } from "jotai";
import { isSidebarOpenAtom } from "@/store/global-atoms";
import { Teamspaces } from "./teamspaces";
import { ChannelsTypes } from "@repo/data";
import { useIsOwnerOrAdmin } from "@/hooks/use-is-owner-or-admin";
import { activeSidebarAtom } from "./sidebar-atoms";

interface Tab {
  Icon: LucideIcon;
  label: string;
  val?: ChannelsTypes | "settings" | "home";
}

const tabs: Tab[] = [
  {
    Icon: Home,
    label: "home",
    val: "home",
  },
  {
    Icon: NotebookText,
    label: "pages",
    val: "page",
  },
  {
    Icon: MessageCircle,
    label: "rooms",
    val: "room",
  },
  {
    Icon: Newspaper,
    label: "threads",
    val: "thread",
  },
  {
    Icon: Database,
    label: "resources",
    val: "resources",
  },
  {
    Icon: Settings,
    label: "settings",
    val: "settings",
  },
];

export function Sidebar() {
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom);
  const { workspaceSlug } = useCurrentWorkspace();

  const [activeSidebar, setActiveSidebar] = useAtom(activeSidebarAtom);

  const { teamId } = useParams<{ teamId: string }>();

  return (
    // <ScrollArea className="flex-1">
    <aside
      className={cn(
        "h-full max-h-full min-h-0 flex-1 shrink-0 grow  overflow-y-auto bg-dim px-2.5 py-1.5 transition-all",
        !isSidebarOpen && "px-0",
      )}
    >
      <div className="flex flex-col gap-4">
        <ul className="flex flex-col gap-1">
          {tabs.map((tab) => {
            const baseUrl = `/${workspaceSlug}`;

            return (
              <li key={tab.label}>
                <SidebarItem
                  Icon={tab.Icon}
                  className="capitalize"
                  isActive={activeSidebar === tab.val}
                  {...(tab.val === "settings" && {
                    href: `${baseUrl}/settings`,
                  })}
                  {...(tab.val === "home" && {
                    href: `${baseUrl}/`,
                  })}
                  {...(tab.val === "resources" &&
                    teamId && {
                      href: `${baseUrl}/resources/${teamId}`,
                    })}
                  onClick={() => {
                    if (tab.val && tab.val !== "settings") {
                      setActiveSidebar(tab.val);
                    }
                  }}
                >
                  {tab.label}
                </SidebarItem>
              </li>
            );
          })}
        </ul>

        {activeSidebar !== "home" ? (
          <Teamspaces type={activeSidebar} isPages={activeSidebar === "page"} />
        ) : (
          <Teamspaces type="page" isPages />
        )}
      </div>
    </aside>
    // </ScrollArea>
  );
}

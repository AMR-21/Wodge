"use client";

import {
  Database,
  Inbox,
  Map,
  MoreHorizontal,
  Search,
  Settings,
  Space,
  User2,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { useStore } from "@/store";
import { cn } from "@repo/ui";
import { SpaceSwitcher } from "./space-switcher";
import { SidebarItemBtn } from "./sidebar-item-btn";
import { Teamspaces } from "./teamspaces";
import { UserCard } from "./user-card";

const staticItems = [
  {
    label: "search",
    Icon: Search,
  },
  {
    label: "updates",
    Icon: Inbox,
  },
  {
    label: "members",
    Icon: User2,
  },
  // {
  //   label: "Storage",
  //   Icon: Database,
  // },
  {
    label: "Settings",
    Icon: Settings,
  },
];

export function Sidebar() {
  const isSidebarOpen = useStore((state) => state.isSidebarOpen);

  return (
    <aside
      className={cn(
        "flex shrink-0 grow flex-col justify-between space-y-6 transition-all",
        isSidebarOpen && "w-56 max-w-56 border-r border-border/50",
        !isSidebarOpen && " invisible w-0 overflow-hidden",
      )}
    >
      <div className="flex h-dvh min-h-0 flex-col space-y-6 px-1.5 py-2.5">
        <ul className="shrink-0 grow-0 space-y-0.5">
          {staticItems.map((item, index) => (
            <SidebarItem
              key={index}
              label={item.label}
              Icon={item.Icon}
              className="capitalize"
            />
          ))}
        </ul>
        <ul className="flex-1 overflow-y-scroll">
          <Teamspaces />
          <Teamspaces />
        </ul>
      </div>

      <UserCard />
    </aside>
  );
}

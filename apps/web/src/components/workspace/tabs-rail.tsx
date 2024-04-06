"use client";

import { TooltipWrapper } from "@repo/ui/components/tooltip-wrapper";
import { Button } from "@repo/ui/components/ui/button";
import {
  Component,
  FileStack,
  FileText,
  Home,
  LucideIcon,
  MessageCircle,
  Newspaper,
  Notebook,
  Settings,
} from "lucide-react";
import { WorkspaceSwitcher } from "./workspace-switcher";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@repo/ui/lib/utils";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

interface Tab {
  Icon: LucideIcon;
  label: string;
  href?: string;
}

const tabs: Tab[] = [
  {
    Icon: Component,
    label: "components",
  },
  {
    Icon: Home,
    label: "home",
    href: "/",
  },
  {
    Icon: Notebook,
    label: "pages",
    href: "/page",
  },
  {
    Icon: MessageCircle,
    label: "Chats & meetings",
    href: "/chat",
  },
  {
    Icon: Newspaper,
    label: "threads",
    href: "/thread",
  },
  {
    Icon: Settings,
    label: "settings",
    href: "/settings",
  },
];

export function TabsRail() {
  return (
    <aside className="bg-dim flex w-12 max-w-12 flex-col items-center gap-2.5 border-r border-r-border/50 px-1.5 py-2.5">
      {/* <div className="flex h-12 min-h-12 items-center ">
        <WorkspaceSwitcher />
      </div> */}
      {tabs.map((tab) => (
        <TabRailItem key={tab.label} tab={tab} />
      ))}
    </aside>
  );
}

export function TabRailItem({ tab }: { tab: Tab }) {
  const { workspaceSlug } = useCurrentWorkspace();

  const pathname = usePathname().split("/").at(2);

  const isActive = tab.href === (pathname ? "/" + pathname : "/");

  const jsx = (
    <Button
      variant="secondary"
      size="icon"
      className={cn("group", isActive && "bg-accent")}
    >
      <tab.Icon
        className={cn(
          "h-5 w-5 opacity-50 transition-all group-hover:opacity-100",
          isActive && "opacity-100",
        )}
      />
    </Button>
  );

  return (
    <TooltipWrapper content={tab.label} side="right" className="capitalize">
      {tab?.href ? (
        <Link href={`/${workspaceSlug}${tab.href}`}>{jsx}</Link>
      ) : (
        jsx
      )}
    </TooltipWrapper>
  );
}

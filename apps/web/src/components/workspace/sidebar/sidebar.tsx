"use client";

import { cn } from "@repo/ui/lib/utils";
import { useParams, usePathname } from "next/navigation";
import { useAppState } from "@repo/ui/store/store";
import { PagesSidebar } from "./pages-sidebar";
import { ChatsSidebar } from "./chats-sidebar";

export function Sidebar() {
  const isSidebarOpen = useAppState((state) => state.isSidebarOpen);
  const pathName = usePathname().split("/").at(2);

  let jsx;

  switch (pathName) {
    case "page":
      jsx = <PagesSidebar />;
      break;
    case "chat":
      jsx = <ChatsSidebar />;
      break;
    default:
      return null;
  }

  return (
    <aside
      className={cn(
        "flex h-full min-h-0 shrink-0 grow flex-col justify-between py-1.5  transition-all",
        isSidebarOpen && "w-52 max-w-52 border-r border-border/50",
        !isSidebarOpen && " invisible w-0 overflow-hidden",
      )}
    >
      {jsx}
    </aside>
  );
}

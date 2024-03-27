import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { cn } from "@repo/ui/lib/utils";
import { SidebarItem } from "../sidebar-item";
import { Teamspaces } from "./teamspaces";

export function PagesSidebar() {
  return (
    <aside
      className={cn(
        "flex h-full min-h-0 shrink-0 grow flex-col justify-between space-y-0 transition-all",
        // isSidebarOpen && "w-56 max-w-56 border-r border-border/50",
        // !isSidebarOpen && " invisible w-0 overflow-hidden",
      )}
    >
      <ScrollArea className="grow px-1.5 py-2">
        <Teamspaces isPages />
      </ScrollArea>
    </aside>
  );
}

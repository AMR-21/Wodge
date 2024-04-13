"use client";
import { SidebarItemBtn } from "./sidebar-item-btn";
import { PanelLeft } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { useAtom } from "jotai";
import { isSidebarOpenAtom } from "@repo/ui/store/atoms";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@repo/ui/components/ui/breadcrumb";
import { useParams } from "next/navigation";
import { useChannelPath } from "@repo/ui/hooks/use-channel-path";

export function AppHeader() {
  const [isSidebarOpen, setSidebar] = useAtom(isSidebarOpenAtom);

  const { teamId } = useParams<{
    teamId?: string;
  }>();

  const path = useChannelPath();

  if (!path) return null;

  const { team, folder, page, room, thread, folderId } = path;

  const openSidebar = setSidebar.bind(null, true);

  return (
    <div className={"flex h-12 items-center transition-all"}>
      <div className="flex basis-full items-center px-1.5 py-2.5">
        {!isSidebarOpen && (
          <SidebarItemBtn
            Icon={PanelLeft}
            className={cn(
              "pointer-events-auto mr-3 transition-all duration-500",
            )}
            onClick={(e) => {
              e.stopPropagation();
              openSidebar();
            }}
          />
        )}
        {teamId && (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>{team}</BreadcrumbItem>
              <BreadcrumbSeparator />
              {folder && !folderId?.startsWith("root-") && (
                <>
                  <BreadcrumbItem>{folder}</BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              {page && <BreadcrumbItem>{page}</BreadcrumbItem>}
              {room && <BreadcrumbItem>{room}</BreadcrumbItem>}
              {thread && <BreadcrumbItem>{thread}</BreadcrumbItem>}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
    </div>
  );
}

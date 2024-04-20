"use client";
import { SidebarItemBtn } from "./sidebar-item-btn";
import { PanelLeft, PhoneCall } from "lucide-react";
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
    <div
      className={
        "z-[9999999999] flex h-12 w-full items-center bg-background px-2.5 py-2 transition-all"
      }
    >
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
              {(page || room || thread) && <BreadcrumbSeparator />}
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

        {room && (
          <SidebarItemBtn
            iconClassName="w-5 h-5"
            Icon={PhoneCall}
            className="ml-auto mr-6"
          />
        )}
      </div>
    </div>
  );
}

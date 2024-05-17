"use client";
import { SidebarItemBtn } from "./sidebar-item-btn";
import { ArrowLeft, ArrowRight, PanelLeft, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { isCallWindowOpenAtom, isSidebarOpenAtom } from "@/store/global-atoms";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { useChannelPath } from "@/hooks/use-channel-path";
import { useAppStore } from "@/store/store";
import { editorUsersAtoms } from "@/components/editor/block-editor/atoms";
import { EditorInfo } from "@/components/editor/block-editor/editor-info";
import { roomAtom } from "../room/[teamId]/[channelId]/atoms";

export function AppHeader() {
  const [isSidebarOpen, setSidebar] = useAtom(isSidebarOpenAtom);

  const { teamId } = useParams<{
    teamId?: string;
    workspaceSlug: string;
  }>();

  const path = useChannelPath();

  const lk_room = useAtomValue(roomAtom);
  const router = useRouter();

  const openSidebar = setSidebar.bind(null, true);

  const setCallWindow = useSetAtom(isCallWindowOpenAtom);

  const displayUsers = useAtomValue(editorUsersAtoms);

  return (
    <div
      className={
        "mt-1.5 flex h-12 w-full items-center  bg-background py-2.5 pl-2 pr-4  transition-all"
      }
    >
      <div className="flex w-full items-center">
        {!isSidebarOpen && (
          <SidebarItemBtn
            Icon={PanelLeft}
            className={cn(
              "pointer-events-auto mr-0.5 transition-all duration-500",
            )}
            onClick={(e) => {
              e.stopPropagation();
              openSidebar();
            }}
          />
        )}

        {path && (
          <>
            <SidebarItemBtn
              onClick={() => router.back()}
              Icon={ArrowLeft}
              className="mr-0.5"
            />
            <SidebarItemBtn
              onClick={() => router.forward()}
              Icon={ArrowRight}
              className="mr-2"
            />
          </>
        )}

        {teamId && (
          <Breadcrumb className="overflow-hidden">
            <BreadcrumbList>
              <BreadcrumbItem>{path?.team.name}</BreadcrumbItem>
              {(path?.page || path?.room) && <BreadcrumbSeparator />}
              {path?.folder && !path?.folder.id?.startsWith("root-") && (
                <>
                  <BreadcrumbItem>{path?.folder.name}</BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              {path?.page && <BreadcrumbItem>{path?.page.name}</BreadcrumbItem>}
              {path?.room && <BreadcrumbItem>{path?.room.name}</BreadcrumbItem>}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {displayUsers && displayUsers.length > 0 && path?.page && (
          <div className="ml-auto flex justify-center">
            <EditorInfo users={displayUsers} />
          </div>
        )}

        <SidebarItemBtn
          iconClassName={cn(
            "h-5 w-5",
            lk_room && "text-green-600 dark:text-green-500",
          )}
          Icon={Video}
          className={cn(
            "hidden ",
            !path?.page && "ml-auto",
            path?.room && "block",
            lk_room && "animate-pulse duration-1000 hover:animate-none",
          )}
          onClick={() => {
            setCallWindow((c) => !c);
          }}
        />
      </div>
    </div>
  );
}

import { Dialog, DialogTrigger } from "@repo/ui/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import {
  FileCog,
  FilePlus,
  FolderCog,
  FolderPlus,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import { SidebarItemBtn } from "../sidebar-item-btn";
import { AddPageForm } from "./add-page-form";
import { AddFolderForm } from "./add-folder-form";
import { useState } from "react";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { nanoid } from "nanoid";
import { ID_LENGTH, WORKSPACE_GROUP_ID_LENGTH } from "@repo/data";
import Link from "next/link";
import { AddRoomForm } from "./add-room-form";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { AddThreadForm } from "./add-thread-form";

interface TeamMoreProps {
  teamId: string;
  children?: React.ReactNode;
}

export function TeamThreadsMore({ teamId, children }: TeamMoreProps) {
  const { workspaceRep, workspaceSlug } = useCurrentWorkspace();

  const { user } = useCurrentUser();

  async function createBlankThread() {
    if (!user) return;
    await workspaceRep?.mutate.createThread({
      teamId,
      name: "New thread",
      createdBy: user.id,
      id: nanoid(ID_LENGTH),
      editGroups: ["team-members"],
      viewGroups: ["team-members"],
      avatar: "",
      isResolved: false,
    });
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {children || (
            <SidebarItemBtn
              Icon={MoreHorizontal}
              className="invisible z-10 -my-1 ml-auto flex transition-all hover:bg-transparent group-hover:visible aria-expanded:visible"
            />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" sideOffset={2}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Threads</DropdownMenuLabel>
            <DropdownMenuItem
              className="gap-2 text-sm"
              onClick={createBlankThread}
            >
              <FilePlus className="h-4 w-4" />
              New thread
            </DropdownMenuItem>

            <DialogTrigger asChild>
              <DropdownMenuItem className="gap-2 text-sm">
                <FileCog className="h-4 w-4" />
                Custom thread
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuGroup>

          {!children && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href={`/${workspaceSlug}/settings/teams/${teamId}`}>
                  <DropdownMenuItem className="gap-2 text-sm">
                    <Settings className="h-4 w-4" />
                    Team settings
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AddThreadForm teamId={teamId} />
    </Dialog>
  );
}

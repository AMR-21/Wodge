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

export function TeamMore({ teamId }: { teamId: string }) {
  const [activeTab, setActiveTab] = useState("folder");
  const { workspaceRep, workspaceSlug } = useCurrentWorkspace();

  async function createBlankPage() {
    await workspaceRep?.mutate.createPage({
      folderId: "root-" + teamId,
      teamId,
      name: "New page",
      id: nanoid(ID_LENGTH),
      editRoles: ["team-members"],
      viewRoles: ["team-members"],
      avatar: "",
    });
  }

  async function createFolder() {
    await workspaceRep?.mutate.updateTeam({
      teamId,
      teamUpdate: {
        action: "addFolder",
        update: {
          folder: {
            name: "New folder",
            viewRoles: ["team-members"],
            editRoles: ["team-members"],
            id: nanoid(WORKSPACE_GROUP_ID_LENGTH),
            channels: [],
          },
        },
      },
    });
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarItemBtn
            Icon={MoreHorizontal}
            className="z-10 -my-1 hover:bg-transparent"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" sideOffset={2}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Pages</DropdownMenuLabel>
            <DropdownMenuItem
              className="gap-2 text-sm"
              onClick={createBlankPage}
            >
              <FilePlus className="h-4 w-4" />
              New page
            </DropdownMenuItem>

            <DialogTrigger asChild>
              <DropdownMenuItem
                className="gap-2 text-sm"
                onClick={() => setActiveTab("page")}
              >
                <FileCog className="h-4 w-4" />
                Custom page
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Folders</DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 text-sm" onClick={createFolder}>
              <FolderPlus className="h-4 w-4" />
              New folder
            </DropdownMenuItem>

            <DialogTrigger asChild>
              <DropdownMenuItem
                className="gap-2 text-sm"
                onClick={() => setActiveTab("folder")}
              >
                <FolderCog className="h-4 w-4" />
                Custom folder
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <Link href={`/${workspaceSlug}/settings?active=teams`}>
              <DropdownMenuItem className="gap-2 text-sm">
                <Settings className="h-4 w-4" />
                Team settings
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {activeTab === "page" ? (
        <AddPageForm teamId={teamId} />
      ) : (
        <AddFolderForm teamId={teamId} />
      )}
    </Dialog>
  );
}

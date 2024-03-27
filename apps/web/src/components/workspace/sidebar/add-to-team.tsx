import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { SidebarItemBtn } from "../sidebar-item-btn";
import {
  FileCog,
  FileCog2,
  FilePlus,
  FilePlus2,
  FolderCog,
  FolderPlus,
  Plus,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { useState } from "react";
import { AddPageForm } from "./add-page-form";
import { DrObj, Folder } from "@repo/data";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { AddFolderForm } from "./add-folder-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { TooltipWrapper } from "@repo/ui/components/tooltip-wrapper";

export function AddToTeam({ teamId }: { teamId: string }) {
  const [activeTab, setActiveTab] = useState("folder");
  const [open, setOpen] = useState(false);

  async function createBlankPage() {}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        {/* <TooltipWrapper content="Add a page" side="right"> */}
        <DropdownMenuTrigger asChild>
          <SidebarItemBtn
            Icon={Plus}
            className="z-10 -my-1 hover:bg-transparent"
          />
        </DropdownMenuTrigger>
        {/* </TooltipWrapper> */}
        <DropdownMenuContent className="w-48" sideOffset={2}>
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="gap-2 text-sm"
              onClick={createBlankPage}
            >
              <FilePlus className="h-4 w-4" />
              Blank page
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
            <DropdownMenuItem
              className="gap-2 text-sm"
              onClick={createBlankPage}
            >
              <FolderPlus className="h-4 w-4" />
              Folder
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

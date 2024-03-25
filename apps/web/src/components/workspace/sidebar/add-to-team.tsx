import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { SidebarItemBtn } from "../sidebar-item-btn";
import { FileCog, FileCog2, FilePlus, FilePlus2, Plus } from "lucide-react";
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { TooltipWrapper } from "@repo/ui/components/tooltip-wrapper";

export function AddToTeam({ teamId }: { teamId: string }) {
  async function createBlankPage() {}

  return (
    <Dialog>
      <DropdownMenu>
        {/* <TooltipWrapper content="Add a page" side="right"> */}
        <DropdownMenuTrigger asChild>
          <SidebarItemBtn
            Icon={Plus}
            className="z-10 -my-1 hover:bg-transparent"
          />
        </DropdownMenuTrigger>
        {/* </TooltipWrapper> */}
        <DropdownMenuContent sideOffset={2}>
          <DropdownMenuItem className="gap-2 text-sm" onClick={createBlankPage}>
            <FilePlus className="h-4 w-4" />
            Blank page
          </DropdownMenuItem>

          <DialogTrigger>
            <DropdownMenuItem className="gap-2 text-sm">
              <FileCog className="h-4 w-4" />
              Custom page
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddPageForm teamId={teamId} />
    </Dialog>
  );
}

"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { Separator } from "@repo/ui/components/ui/separator";
import { useUserWorkspaces } from "@repo/ui/hooks/use-user-workspaces";
import { cn } from "@repo/ui/lib/utils";
import { Button, buttonVariants } from "@repo/ui/components/ui/button";
import {
  Building2,
  Check,
  ChevronsUpDown,
  PanelLeft,
  PanelLeftClose,
  Plus,
  Settings,
  UserRoundCog,
} from "lucide-react";
import { UserWorkspacesStore } from "@repo/data";
import { useCurrentWorkspaceId } from "@repo/ui/hooks/use-current-workspace-id";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SidebarItemBtn } from "./sidebar-item-btn";

export function WorkspaceSwitcher() {
  const { workspace, workspaceId } = useCurrentWorkspace();
  const { userWorkspaces } = useUserWorkspaces();

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <div
          className={cn(
            buttonVariants({ variant: "ghost", size: "fit" }),
            "group w-full cursor-pointer items-center justify-start  pl-[0.345rem]",
          )}
        >
          <Avatar className="mr-3 h-6 w-6 shrink-0 rounded-md border border-primary/30 text-xs">
            {/* <AvatarImage src={workspace?.avatar} /> */}
            <AvatarFallback className=" rounded-md text-sm uppercase">
              {workspace?.name[0]}
            </AvatarFallback>
          </Avatar>

          <p className="mr-1.5 truncate">{workspace?.name}</p>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50 group-hover:opacity-100" />

          <SidebarItemBtn Icon={PanelLeftClose} className="ml-auto" />
        </div>
      </PopoverTrigger>

      <PopoverContent align="start" alignOffset={0} className="max-w-60 p-0">
        <div className="flex flex-col gap-0.5 p-2">
          {userWorkspaces?.map((ws) => (
            <SwitcherItem key={ws.workspaceId} workspace={ws} />
          ))}
        </div>
        <Separator />
        <div className="flex flex-col gap-0.5 p-2">
          <Link href="/">
            <Button
              variant="ghost"
              size="fit"
              className="w-full justify-start gap-2 pl-2 opacity-50 transition-all hover:opacity-100"
            >
              <Building2 className="h-4 w-4 shrink-0" />
              All workspaces
            </Button>
          </Link>
          <Link href={`/${workspaceId}/settings`}>
            <Button
              variant="ghost"
              size="fit"
              className="w-full justify-start gap-2 pl-2 opacity-50 transition-all hover:opacity-100"
            >
              <Settings className="h-4 w-4 shrink-0" />
              Workspace settings
            </Button>
          </Link>
          <Link href={`/${workspaceId}/settings?active=members`}>
            <Button
              variant="ghost"
              size="fit"
              className="w-full justify-start gap-2 pl-2 opacity-50 transition-all hover:opacity-100"
            >
              <UserRoundCog className="h-4 w-4 shrink-0" />
              Invite & manage members
            </Button>
          </Link>
        </div>
        <Separator />
        <div className="p-2">
          <Button
            variant="ghost"
            size="fit"
            className="w-full justify-start gap-2 pl-2 opacity-50 transition-all hover:opacity-100"
          >
            <Plus className="h-4 w-4 shrink-0" />
            Add a workspace
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SwitcherItem({ workspace }: { workspace: UserWorkspacesStore }) {
  const curWsId = useCurrentWorkspaceId();
  const router = useRouter();
  return (
    <div
      tabIndex={0}
      className={cn(
        buttonVariants({
          variant: "ghost",
          size: "fit",
        }),
        "w-full cursor-pointer justify-start gap-2.5",
      )}
      onClick={() => router.push(`/${workspace.workspaceId}`)}
    >
      <Avatar className="h-6 w-6 shrink-0 rounded-md border border-primary/30 text-xs">
        {/* <AvatarImage src={workspace?.avatar} /> */}
        <AvatarFallback className=" rounded-md  uppercase">
          {workspace.workspaceName[0]}
        </AvatarFallback>
      </Avatar>

      <p className="truncate">{workspace.workspaceName}</p>

      {curWsId === workspace.workspaceId && (
        <Check className="ml-auto h-4 w-4 shrink-0" />
      )}
    </div>
  );
}

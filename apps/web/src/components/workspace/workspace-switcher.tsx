"use client";

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

import { useUserWorkspaces } from "@repo/ui/hooks/use-user-workspaces";
import { cn } from "@repo/ui/lib/utils";
import { buttonVariants } from "@repo/ui/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Workspace } from "@repo/data";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

export function WorkspaceSwitcher() {
  const { workspace, workspaceSlug } = useCurrentWorkspace();
  const { userWorkspaces } = useUserWorkspaces();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            buttonVariants({ variant: "ghost", size: "fit" }),
            "group w-fit cursor-pointer items-center justify-start pl-[0.345rem]",
          )}
        >
          <Avatar className="mr-2 h-6 w-6 shrink-0 rounded-md border border-primary/30 text-xs">
            {/* <AvatarImage src={workspace?.avatar} /> */}
            <AvatarFallback className=" rounded-md text-sm uppercase">
              {workspace?.name[0]}
            </AvatarFallback>
          </Avatar>

          <p className="mr-1.5 truncate">{workspace?.name}</p>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50 group-hover:opacity-100" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent alignOffset={0} align="start" className="w-52">
        <DropdownMenuGroup>
          <Link href="/">
            <DropdownMenuItem>All Workspaces</DropdownMenuItem>
          </Link>
          <Link href={`/${workspaceSlug}/settings`}>
            <DropdownMenuItem>Workspace settings</DropdownMenuItem>
          </Link>

          <Link href={`/${workspaceSlug}/settings/members`}>
            <DropdownMenuItem>Invite & manage members</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Switch workspace</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="flex w-48 flex-col gap-0.5">
                {userWorkspaces?.map((ws) => (
                  <SwitcherItem key={ws.id} workspace={ws} />
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SwitcherItem({ workspace }: { workspace: Workspace }) {
  const { workspaceSlug } = useCurrentWorkspace();
  return (
    <Link href={`/${workspace.slug}`}>
      <DropdownMenuItem
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "fit",
          }),
          "w-full cursor-pointer justify-start gap-2.5",
        )}
      >
        <Avatar className="h-6 w-6 shrink-0 rounded-md border border-primary/30 text-xs">
          {/* <AvatarImage src={workspace?.avatar} /> */}
          <AvatarFallback className=" rounded-md  uppercase">
            {workspace.name[0]}
          </AvatarFallback>
        </Avatar>

        <p className="truncate">{workspace.name}</p>

        {workspaceSlug === workspace.slug && (
          <Check className="ml-auto h-4 w-4 shrink-0" />
        )}
      </DropdownMenuItem>
    </Link>
  );
}

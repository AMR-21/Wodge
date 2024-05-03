"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

import { useUserWorkspaces } from "@repo/ui/hooks/use-user-workspaces";
import { cn } from "@repo/ui/lib/utils";
import { buttonVariants } from "@repo/ui/components/ui/button";
import {
  Building2,
  Check,
  ChevronsUpDown,
  LogOut,
  Settings,
  Users2,
} from "lucide-react";
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
import { useIsOwnerOrAdmin } from "@repo/ui/hooks/use-is-owner-or-admin";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@repo/ui/components/ui/toast";
import { useRouter } from "next/navigation";

export function WorkspaceSwitcher() {
  const { workspace, workspaceSlug } = useCurrentWorkspace();
  const { userWorkspaces } = useUserWorkspaces();

  const isPrivileged = useIsOwnerOrAdmin();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            buttonVariants({ variant: "ghost", size: "fit" }),
            "group max-w-44 cursor-pointer items-center justify-start pl-[0.345rem]",
          )}
        >
          {workspace?.avatar ? (
            <Avatar className="mr-2 h-6 w-6 shrink-0 rounded-md border border-primary/30 text-xs">
              <AvatarImage src={workspace.avatar} />
              <AvatarFallback className=" rounded-md text-sm uppercase">
                {workspace?.name[0]}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="mr-2 h-6 w-6 shrink-0 rounded-md border border-primary/30 text-xs">
              <AvatarFallback className=" rounded-md text-sm uppercase">
                {workspace?.name[0]}
              </AvatarFallback>
            </Avatar>
          )}

          <p className="mr-1.5 truncate">{workspace?.name}</p>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50 group-hover:opacity-100" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent alignOffset={0} align="start" className="w-52">
        <DropdownMenuGroup>
          <Link href="/">
            <DropdownMenuItem className="gap-2 text-sm">
              <Building2 className="h-4 w-4" />
              All Workspaces
            </DropdownMenuItem>
          </Link>

          <Link href={`/${workspaceSlug}/settings`}>
            <DropdownMenuItem className="gap-2 text-sm">
              <Settings className="h-4 w-4" />
              Workspace settings
            </DropdownMenuItem>
          </Link>
          {isPrivileged && (
            <>
              <Link href={`/${workspaceSlug}/settings/members`}>
                <DropdownMenuItem className="gap-2 text-sm">
                  <Users2 className="h-4 w-4" />
                  Manage members
                </DropdownMenuItem>
              </Link>
            </>
          )}
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

          <DropdownMenuItem
            className="gap-2 text-sm"
            onClick={async () => {
              const supabase = createClient();

              const { error } = await supabase.auth.signOut();

              if (error) {
                toast.error("Failed to log out");
              } else {
                router.push("/login");
              }
            }}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </DropdownMenuItem>
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
        {workspace?.avatar ? (
          <Avatar className="h-6 w-6 shrink-0 rounded-md border border-primary/30 text-xs">
            <AvatarImage src={workspace.avatar} />

            <AvatarFallback className=" rounded-md  uppercase">
              {workspace.name[0]}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="h-6 w-6 shrink-0 rounded-md border border-primary/30 text-xs">
            <AvatarFallback className=" rounded-md  uppercase">
              {workspace.name[0]}
            </AvatarFallback>
          </Avatar>
        )}

        <p className="truncate">{workspace.name}</p>

        {workspaceSlug === workspace.slug && (
          <Check className="ml-auto h-4 w-4 shrink-0" />
        )}
      </DropdownMenuItem>
    </Link>
  );
}

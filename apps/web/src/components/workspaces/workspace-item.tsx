import { UserWorkspacesStore, Workspace } from "@repo/data";
import { ChevronRight, Cloud, Laptop } from "lucide-react";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Skeleton } from "@repo/ui/components/ui/skeleton";

export function WorkspaceItem({
  workspace,
}: {
  workspace: UserWorkspacesStore;
}) {
  const Icon = workspace.environment === "local" ? Laptop : Cloud;

  return (
    <Link href={"/workspaces/" + workspace.workspaceId} className="w-full">
      <div className="group flex w-full shrink-0 items-center gap-2 overflow-hidden py-3 pl-4 transition-all hover:bg-background dark:hover:bg-surface">
        <Avatar className="h-10 w-10 rounded-md">
          {/* <AvatarImage src={workspace.workspaceAvatar} /> */}
          <AvatarFallback className="rounded-md text-lg uppercase transition-all  ">
            {workspace.workspaceName?.[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <p className="truncate text-sm">{workspace.workspaceName}</p>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Icon className="h-3.5 w-3.5" />
            <p className="text-xs capitalize">{workspace.environment}</p>
          </div>
        </div>

        <div className="ml-auto flex translate-x-full items-center gap-0.5 text-xs text-primary-base transition-all group-hover:-translate-x-4">
          <p>Open</p>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

WorkspaceItem.Skeleton = function () {
  return (
    <div className="flex w-full gap-2 px-4 py-1.5">
      <Skeleton className="h-6 w-6" />
      <Skeleton className="h-6 w-full" />
    </div>
  );
};

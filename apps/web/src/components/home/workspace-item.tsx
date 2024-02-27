import { WorkspaceType } from "@repo/data/schemas";
import { Avatar, AvatarFallback, AvatarImage, Skeleton } from "@repo/ui";
import { ChevronRight, Cloud, Laptop } from "lucide-react";
import Link from "next/link";

export function WorkspaceItem({ workspace }: { workspace: WorkspaceType }) {
  const Icon = workspace.environment === "local" ? Laptop : Cloud;

  return (
    <Link href={"/" + workspace.id} className="w-full">
      <div className="group flex w-full shrink-0 items-center gap-2 overflow-hidden py-3 pl-4 transition-all hover:bg-background dark:hover:bg-surface">
        <Avatar className="h-10 w-10 rounded-md">
          <AvatarImage src={workspace.avatar} />
          <AvatarFallback className="rounded-md text-lg uppercase transition-all  ">
            {workspace.name[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <p className="truncate text-sm">{workspace.name}</p>
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

import { Workspace } from "@repo/data";
import { ChevronRight, Cloud, Laptop } from "lucide-react";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Skeleton } from "@repo/ui/components/ui/skeleton";

export function WorkspaceItem({ workspace }: { workspace: Workspace }) {
  return (
    <Link href={"/" + workspace.slug} className="w-full">
      <div className="dark:hover:bg-surface group flex w-full shrink-0 items-center gap-2 overflow-hidden py-3 pl-4 transition-all hover:bg-background">
        <Avatar className="h-8 w-8 rounded-md border border-primary/30">
          {/* <AvatarImage src={workspace.workspaceAvatar} /> */}
          <AvatarFallback className="rounded-md text-lg uppercase transition-all  ">
            {workspace.name?.[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <p className="truncate text-sm">{workspace.name}</p>
        </div>

        <div className="text-primary-base ml-auto flex translate-x-full items-center gap-0.5 text-xs transition-all group-hover:-translate-x-4">
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

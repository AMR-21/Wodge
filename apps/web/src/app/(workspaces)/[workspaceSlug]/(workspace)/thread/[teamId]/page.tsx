"use client";

import { SidebarItemBtn } from "@/components/workspace/sidebar-item-btn";
import { AddThreadForm } from "@/components/workspace/sidebar/add-thread-form";
import { Thread } from "@repo/data";
import { Button } from "@repo/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@repo/ui/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { GanttChart, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

function ThreadsPage() {
  const { structure, workspaceSlug, workspaceRep } = useCurrentWorkspace();

  const { teamId } = useParams<{ teamId: string }>();

  const team = useMemo(
    () => structure.teams?.find((t) => t.id === teamId),
    [structure.teams, teamId],
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="w-full gap-1">
            <Plus className="h-4 w-4" />
            New Thread
          </Button>
        </DialogTrigger>
        <AddThreadForm teamId={teamId} />
      </Dialog>

      <ScrollArea className="w-full">
        <div className="flex w-full flex-col gap-2">
          {team?.threads.map((thread) => (
            <div
              className="flex w-full cursor-pointer rounded-md bg-secondary/30 px-4 py-2 hover:bg-secondary/70"
              key={thread.id}
            >
              <Link
                href={`/${workspaceSlug}/thread/${teamId}/${thread.id}`}
                className="w-full"
              >
                <div className="flex w-full items-center gap-2">
                  <GanttChart className="h-4 w-4" />
                  <p className="shrink-0">{thread.name}</p>
                  <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarItemBtn
                            className="ml-auto"
                            Icon={MoreHorizontal}
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DialogTrigger asChild>
                            <DropdownMenuItem className="text-gray-500 hover:text-gray-400">
                              Edit thread
                            </DropdownMenuItem>
                          </DialogTrigger>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500 hover:text-red-400"
                            onClick={async () => {
                              await workspaceRep?.mutate.deleteChannel({
                                channelId: thread.id,
                                type: "thread",
                                teamId,
                              });
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <AddThreadForm
                        teamId={teamId}
                        thread={thread as Thread}
                      />
                    </Dialog>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default ThreadsPage;

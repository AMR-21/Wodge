"use client";

import { SidebarItem } from "@/components/workspace/sidebar-item";
import { SidebarItemBtn } from "@/components/workspace/sidebar-item-btn";
import { TeamThreadsMore } from "@/components/workspace/sidebar/team-threads-more";
import { Button } from "@repo/ui/components/ui/button";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { CircleDot, GanttChart, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

function ThreadsPage() {
  const { structure, workspaceSlug } = useCurrentWorkspace();

  const { teamId } = useParams<{ teamId: string }>();

  const team = useMemo(
    () => structure.teams?.find((t) => t.id === teamId),
    [structure.teams, teamId],
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <TeamThreadsMore teamId={teamId}>
        <Button variant="secondary" className="w-full gap-1">
          <Plus className="h-4 w-4" />
          New Thread
        </Button>
      </TeamThreadsMore>

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
                  <SidebarItemBtn className="ml-auto" Icon={MoreHorizontal} />
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

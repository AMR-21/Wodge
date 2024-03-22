import * as React from "react";

import { SidebarItem } from "../sidebar-item";
import {
  ChevronRight,
  Component,
  GripVertical,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { SidebarItemBtn } from "../sidebar-item-btn";
import { DrObj, Team } from "@repo/data";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion";
import { cn } from "@repo/ui/lib/utils";
import { Folders } from "./folders";
import { useAtom, useAtomValue } from "jotai";
import {
  isDraggingTeamAtom,
  openTeamsAtom,
  tempOpenTeamsAtom,
} from "@/app/(app)/workspaces/[workspaceId]/(workspace)/atoms";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { AddToTeamForm } from "./add-to-team-form";

export function Teamspaces() {
  const { structure } = useCurrentWorkspace();

  const teamsId = useMemo(
    () => structure.teams?.map((t) => t.id) || [],
    [structure.teams],
  );
  const [openTeams, setOpenTeams] = useAtom(openTeamsAtom);

  return (
    <div className="h-full min-h-full shrink-0">
      <Accordion type="multiple" value={openTeams} onValueChange={setOpenTeams}>
        <SortableContext items={teamsId} strategy={verticalListSortingStrategy}>
          <ul>
            {structure.teams?.map((team, i) => (
              <SortableTeamspace key={team.id} team={team} idx={i} />
            ))}
          </ul>
        </SortableContext>
      </Accordion>
    </div>
  );
}

// Teamspace
function SortableTeamspace({ team, idx }: { team: DrObj<Team>; idx: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    activeIndex,
    over,
    overIndex,
    isOver,
    active,
    index,
    isSorting,
    data,
  } = useSortable({
    id: team.id,
    data: {
      type: "team",
      idx,
    },
  });

  const isDraggingTeam = useAtomValue(isDraggingTeamAtom);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSomethingOver = index === overIndex;
  const isTeamOver = active?.data?.current?.type === "team";

  const isOpen = useAtomValue(openTeamsAtom).includes(team.id);

  const isChannelOver =
    active?.data?.current?.type === "channel" &&
    active?.data?.current?.teamId !== team.id;

  const isFolderOver =
    active?.data?.current?.type === "folder" &&
    active?.data?.current?.teamId !== team.id;

  const isChanFoldOver = isSomethingOver && (isChannelOver || isFolderOver);

  const isAbove = activeIndex > overIndex;
  const isBelow = activeIndex < overIndex;

  return (
    <AccordionItem
      value={team.id}
      className={cn(
        "border-b-2 border-t-2 border-b-transparent border-t-transparent",
        isSomethingOver && isTeamOver && isAbove && "border-t-blue-400",
        isSomethingOver && isTeamOver && isBelow && "border-b-blue-400",
      )}
      {...listeners}
      {...attributes}
    >
      <AccordionTrigger asChild>
        <div
          className={cn(
            "border-b-2 border-b-transparent",
            isSomethingOver && isOpen && isChanFoldOver && "border-b-blue-400",
          )}
        >
          <Teamspace
            team={team}
            isChanFoldOver={isChanFoldOver}
            isDragging={isDragging}
            ref={setNodeRef}
          />
        </div>
      </AccordionTrigger>
      <AccordionContent
        className={cn("p-0 pl-3 transition-all", isDraggingTeam && "hidden")}
      >
        <Folders teamId={team.id} folders={team.folders} />
      </AccordionContent>
    </AccordionItem>
  );
}

interface DraggableProps {
  isChanFoldOver?: boolean;
  isDragging: boolean;
}

export const Teamspace = React.forwardRef<
  HTMLLIElement,
  { team: DrObj<Team> } & DraggableProps & React.HTMLAttributes<HTMLLIElement>
>(({ team, isChanFoldOver, isDragging, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className="group flex grow items-center border-2 border-transparent"
      {...props}
    >
      <SidebarItem
        aria-disabled={isDragging}
        isActive={isChanFoldOver}
        label={team.name}
        Icon={Component}
      >
        <ChevronRight className=" ml-1.5 h-3.5 w-3.5 min-w-3.5 max-w-3.5 transition-transform group-data-[state=open]:rotate-90" />
        <div
          className="invisible ml-auto flex transition-all group-hover:visible"
          onClick={(e) => e.stopPropagation()}
        >
          <SidebarItemBtn
            Icon={MoreHorizontal}
            className="-my-1 hover:bg-transparent"
          />
          <AddToTeamForm teamId={team.id} folders={team.folders} />
        </div>
      </SidebarItem>
    </li>
  );
});

Teamspace.displayName = "Teamspace";

import * as React from "react";

import { SidebarItem } from "./sidebar-item";
import {
  ChevronRight,
  Component,
  GripVertical,
  MoreHorizontal,
} from "lucide-react";
import { SidebarItemBtn } from "./sidebar-item-btn";
import { Team } from "@repo/data";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion";
import { cn } from "@repo/ui/lib/utils";

export function Teamspaces({ teams }: { teams: Team[] }) {
  const teamsId = useMemo(() => teams?.map((t) => t.id) || [], [teams]);

  return (
    <div>
      <Accordion type="multiple">
        <SortableContext items={teamsId} strategy={verticalListSortingStrategy}>
          <ul>
            {teams?.map((team) => (
              <SortableTeamSpace key={team.id} team={team} />
            ))}
          </ul>
        </SortableContext>
      </Accordion>
    </div>
  );
}

// Teamspace

function SortableTeamSpace({ team }: { team: Team }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    activeIndex,
  } = useSortable({ id: team.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <AccordionItem value={team.id}>
      <AccordionTrigger style={style} {...listeners} {...attributes} asChild>
        <div>
          <TeamSpace
            team={team}
            activeIndex={activeIndex}
            isDragging={isDragging}
            ref={setNodeRef}
          />
        </div>
      </AccordionTrigger>
    </AccordionItem>
  );
}

interface DraggableProps {
  activeIndex?: number;
  isDragging: boolean;
}

const TeamSpace = React.forwardRef<
  HTMLLIElement,
  { team: Team } & DraggableProps & React.HTMLAttributes<HTMLLIElement>
>(({ team, activeIndex, isDragging, ...props }, ref) => {
  return (
    <li ref={ref} className="group flex grow items-center" {...props}>
      <GripVertical
        className={cn(
          "invisible h-3.5 w-3.5 text-black group-hover:visible",
          activeIndex && activeIndex !== -1 && "invisible",
        )}
      />
      <SidebarItem
        aria-disabled={isDragging}
        label={team.name}
        Icon={Component}
      >
        <ChevronRight className=" ml-1.5 h-3.5 w-3.5 min-w-3.5 max-w-3.5 transition-transform group-data-[state=open]:rotate-90" />
        <SidebarItemBtn Icon={MoreHorizontal} className="-my-1 ml-auto" />
      </SidebarItem>
    </li>
  );
});

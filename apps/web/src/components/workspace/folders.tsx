import * as React from "react";

import { SidebarItem } from "./sidebar-item";
import {
  ChevronRight,
  Component,
  GripVertical,
  MoreHorizontal,
} from "lucide-react";
import { SidebarItemBtn } from "./sidebar-item-btn";
import { Team, Dir } from "@repo/data";
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
import { Channels } from "./channels";
import { useAtom, useAtomValue } from "jotai";
import {
  isDraggingFolderAtom,
  tempOpenDirsAtom,
} from "@/app/(app)/workspaces/[workspaceId]/(workspace)/atoms";
import { DndContext } from "@dnd-kit/core";

export function Directories({ dirs, teamId }: { dirs: Dir[]; teamId: string }) {
  const dirsIds = useMemo(() => dirs?.map((d) => d.id) || [], [dirs]);

  const [openDirs, setOpenDirs] = useAtom(tempOpenDirsAtom);

  return (
    <div className="h-full">
      <Accordion type="multiple" value={openDirs} onValueChange={setOpenDirs}>
        <SortableContext items={dirsIds} strategy={verticalListSortingStrategy}>
          <ul className="">
            {dirs?.map((dir) => (
              <SortableDirectory key={dir.id} dir={dir} teamId={teamId} />
            ))}
          </ul>
        </SortableContext>
      </Accordion>
    </div>
  );
}

// Teamspace
function SortableDirectory({ dir, teamId }: { dir: Dir; teamId: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    activeIndex,
    isOver,
  } = useSortable({
    id: dir.id,
    data: {
      type: "folder",
      teamId: teamId,
    },
  });

  const isDraggingFolder = useAtomValue(isDraggingFolderAtom);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <AccordionItem value={dir.id}>
      <AccordionTrigger style={style} {...listeners} {...attributes} asChild>
        <div>
          <Directory
            directory={dir}
            activeIndex={activeIndex}
            isDragging={isDragging}
            isOver={isOver}
            ref={setNodeRef}
          />
        </div>
      </AccordionTrigger>
      <AccordionContent
        className={cn("pl-3 transition-all", isDraggingFolder && "hidden")}
      >
        <Channels teamId={teamId} channels={dir.channels} folderId={dir.id} />
      </AccordionContent>
    </AccordionItem>
  );
}

interface DraggableProps {
  activeIndex?: number;
  isDragging: boolean;
  isOver: boolean;
}

export const Directory = React.forwardRef<
  HTMLLIElement,
  { directory: Dir } & DraggableProps & React.HTMLAttributes<HTMLLIElement>
>(({ directory, activeIndex, isOver, isDragging, ...props }, ref) => {
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
        label={directory.name}
        Icon={Component}
        className={cn(isOver && "text-red-500")}
      >
        <ChevronRight className=" ml-1.5 h-3.5 w-3.5 min-w-3.5 max-w-3.5 transition-transform group-data-[state=open]:rotate-90" />
        <SidebarItemBtn Icon={MoreHorizontal} className="-my-1 ml-auto" />
      </SidebarItem>
    </li>
  );
});

Directory.displayName = "Directory";

import * as React from "react";

import { SidebarItem } from "../sidebar-item";
import { FolderIcon, MoreHorizontal } from "lucide-react";
import { SidebarItemBtn } from "../sidebar-item-btn";
import { DrObj, type Folder as FolderType } from "@repo/data";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMemo } from "react";
import { cn } from "@repo/ui/lib/utils";
import { useAtomValue } from "jotai";
import { openFoldersAtom } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/atoms";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible";
import { Channels } from "./channels";
import { TeamMore } from "./team-more";

export function Folders({
  folders,
  teamId,
}: {
  folders: readonly DrObj<FolderType>[];
  teamId: string;
}) {
  const foldersIds = useMemo(() => folders?.map((d) => d.id) || [], [folders]);

  return (
    <div className="h-full">
      <SortableContext
        items={foldersIds}
        strategy={verticalListSortingStrategy}
      >
        <ul className="flex flex-col gap-1">
          {folders?.map((f, i) => (
            <SortableDirectory key={f.id} folder={f} teamId={teamId} idx={i} />
          ))}
        </ul>
      </SortableContext>
    </div>
  );
}

// Teamspace
function SortableDirectory({
  folder,
  teamId,
  idx,
}: {
  folder: DrObj<FolderType>;
  teamId: string;
  idx: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    activeIndex,
    isOver,
    active,
    index,
    overIndex,
  } = useSortable({
    id: folder.id,
    data: {
      type: "folder",
      teamId: teamId,
      idx,
    },
  });

  const isRoot = folder.id.startsWith("root");

  const isOpen = useAtomValue(openFoldersAtom).includes(folder.id);
  const isSomethingOver = index === overIndex;
  const isChannelOver =
    isSomethingOver &&
    active?.data?.current?.type === "channel" &&
    active?.data?.current?.folderId !== folder.id;

  const isFolderOver = active?.data?.current?.type === "folder";

  const isAbove = activeIndex > overIndex;
  const isBelow = activeIndex < overIndex;

  return (
    <Collapsible
      defaultOpen={isRoot}
      className={
        cn()
        // "border-b-2 border-t-2 border-b-transparent border-t-transparent",
        // isSomethingOver && isFolderOver && isAbove && "border-t-blue-400",
        // isSomethingOver && isFolderOver && isBelow && "border-b-blue-400",
        // !isRoot && "pl-3",
      }
    >
      <CollapsibleTrigger asChild>
        {!isRoot && (
          <div
            className={cn(
              // "border-b-2 border-b-transparent",
              isSomethingOver && isOpen && isChannelOver && "border-b-blue-400",
            )}
          >
            <Folder
              folder={folder}
              teamId={teamId}
              isChannelOver={isChannelOver}
              isDragging={isDragging}
              ref={setNodeRef}
            />
          </div>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn("transition-all", !isRoot && "py-1  pl-[0.9375rem]")}
      >
        <div
          className={cn(!isRoot && "border-l border-border p-0 pl-[0.3025rem]")}
        >
          <Channels
            teamId={teamId}
            channels={folder.channels}
            folderId={folder.id}
            type="page"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface DraggableProps {
  isChannelOver?: boolean;
  isDragging: boolean;
  teamId: string;
}

export const Folder = React.forwardRef<
  HTMLLIElement,
  { folder: DrObj<FolderType> } & DraggableProps &
    React.HTMLAttributes<HTMLLIElement>
>(({ folder, teamId, isChannelOver, isDragging, ...props }, ref) => {
  return (
    <li ref={ref} className="group flex grow items-center" {...props}>
      {/* <GripVertical
        className={cn(
          "invisible h-3.5 w-3.5 text-black group-hover:visible",
          activeIndex && activeIndex !== -1 && "invisible",
        )}
      /> */}
      <SidebarItem
        aria-disabled={isDragging}
        isActive={isChannelOver}
        Icon={FolderIcon}
        collapsible
      >
        <span className="select-none truncate">{folder.name}</span>

        <div
          className="ml-auto"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <TeamMore folderId={folder.id} teamId={teamId} />
        </div>
      </SidebarItem>
    </li>
  );
});

// Folder.displayName = "Folder";

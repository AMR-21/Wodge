import * as React from "react";

import { SidebarItem } from "../sidebar-item";
import {
  ChevronRight,
  Component,
  FolderIcon,
  GripVertical,
  MoreHorizontal,
} from "lucide-react";
import { SidebarItemBtn } from "../sidebar-item-btn";
import { DrObj, type Folder as FolderType } from "@repo/data";
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
import { Pages } from "./pages";
import { useAtom, useAtomValue } from "jotai";
import { openFoldersAtom } from "@/app/(workspaces)/[workspaceId]/(workspace)/atoms";
import { Input } from "@repo/ui/components/ui/input";

export function Folders({
  folders,
  teamId,
}: {
  folders: readonly DrObj<FolderType>[];
  teamId: string;
}) {
  const foldersIds = useMemo(() => folders?.map((d) => d.id) || [], [folders]);

  const [openFolders, setOpenFolders] = useAtom(openFoldersAtom);

  return (
    <div className="h-full">
      <Accordion
        type="multiple"
        value={[`root-${teamId}`, ...openFolders]}
        onValueChange={setOpenFolders}
      >
        <SortableContext
          items={foldersIds}
          strategy={verticalListSortingStrategy}
        >
          <ul className="">
            {folders?.map((f, i) => (
              <SortableDirectory
                key={f.id}
                folder={f}
                teamId={teamId}
                idx={i}
              />
            ))}
          </ul>
        </SortableContext>
      </Accordion>
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
    <AccordionItem
      value={folder.id}
      className={
        cn()
        // "border-b-2 border-t-2 border-b-transparent border-t-transparent",
        // isSomethingOver && isFolderOver && isAbove && "border-t-blue-400",
        // isSomethingOver && isFolderOver && isBelow && "border-b-blue-400",
        // !isRoot && "pl-3",
      }
    >
      <AccordionTrigger {...listeners} {...attributes} asChild>
        {!isRoot && (
          <div
            className={cn(
              // "border-b-2 border-b-transparent",
              isSomethingOver && isOpen && isChannelOver && "border-b-blue-400",
            )}
          >
            <Folder
              folder={folder}
              isChannelOver={isChannelOver}
              isDragging={isDragging}
              ref={setNodeRef}
            />
          </div>
        )}
      </AccordionTrigger>
      <AccordionContent
        className={cn("pb-0.5 transition-all", !isRoot && "pl-3")}
      >
        <Pages
          teamId={teamId}
          channels={folder.channels}
          folderId={folder.id}
        />
      </AccordionContent>
    </AccordionItem>
  );
}

interface DraggableProps {
  isChannelOver?: boolean;
  isDragging: boolean;
}

export const Folder = React.forwardRef<
  HTMLLIElement,
  { folder: DrObj<FolderType> } & DraggableProps &
    React.HTMLAttributes<HTMLLIElement>
>(({ folder, isChannelOver, isDragging, ...props }, ref) => {
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
        <span className="truncate">{folder.name}</span>
        <SidebarItemBtn Icon={MoreHorizontal} className="-my-1 ml-auto" />
      </SidebarItem>
    </li>
  );
});

Folder.displayName = "Folder";

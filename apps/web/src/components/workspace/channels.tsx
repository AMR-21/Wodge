import * as React from "react";

import { SidebarItem } from "./sidebar-item";
import {
  ChevronRight,
  Component,
  GripVertical,
  MoreHorizontal,
} from "lucide-react";
import { SidebarItemBtn } from "./sidebar-item-btn";
import { Team, Dir, type Channel as ChannelType } from "@repo/data";
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

export function Channels({
  channels,
  folderId,
  teamId,
}: {
  channels: ChannelType[];
  folderId: string;
  teamId: string;
}) {
  const channelsIds = useMemo(
    () => channels?.map((c) => c.id) || [],
    [channels],
  );
  // console.log({ teamsId, teams });

  return (
    <div>
      <SortableContext
        items={channelsIds}
        strategy={verticalListSortingStrategy}
      >
        <ul>
          {channels?.map((channel) => (
            <SortableChannel
              key={channel.id}
              channel={channel}
              folderId={folderId}
              teamId={teamId}
            />
          ))}
        </ul>
      </SortableContext>
    </div>
  );
}

// Teamspace
function SortableChannel({
  channel,
  folderId,
  teamId,
}: {
  channel: ChannelType;
  folderId: string;
  teamId: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    activeIndex,
  } = useSortable({
    id: channel.id,
    data: {
      type: "channel",
      folderId,
      teamId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div style={style} {...listeners} {...attributes}>
      <Channel
        channel={channel}
        activeIndex={activeIndex}
        isDragging={isDragging}
        ref={setNodeRef}
      />
    </div>
  );
}

interface DraggableProps {
  activeIndex?: number;
  isDragging: boolean;
}

export const Channel = React.forwardRef<
  HTMLLIElement,
  { channel: ChannelType } & DraggableProps &
    React.HTMLAttributes<HTMLLIElement>
>(({ channel, activeIndex, isDragging, ...props }, ref) => {
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
        label={channel.name}
        Icon={Component}
      >
        <ChevronRight className=" ml-1.5 h-3.5 w-3.5 min-w-3.5 max-w-3.5 transition-transform group-data-[state=open]:rotate-90" />
        <SidebarItemBtn Icon={MoreHorizontal} className="-my-1 ml-auto" />
      </SidebarItem>
    </li>
  );
});

Channel.displayName = "Channel";

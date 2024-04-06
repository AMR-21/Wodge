import * as React from "react";

import { SidebarItem } from "../sidebar-item";
import { FileText, MoreHorizontal } from "lucide-react";
import { SidebarItemBtn } from "../sidebar-item-btn";
import { ChannelsTypes, DrObj, type Channel as ChannelType } from "@repo/data";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";

import { cn } from "@repo/ui/lib/utils";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";

interface ChannelsProps {
  channels: readonly DrObj<ChannelType>[];
  folderId?: string;
  teamId: string;
  type: ChannelsTypes;
}

interface ChannelProps {
  channel: DrObj<ChannelType>;
  folderId?: string;
  teamId: string;
  type: ChannelsTypes;
  idx: number;
}

export function Channels({ channels, folderId, teamId, type }: ChannelsProps) {
  const channelsIds = useMemo(
    () => channels?.map((c) => c.id) || [],
    [channels],
  );

  return (
    <div>
      <SortableContext
        items={channelsIds}
        strategy={verticalListSortingStrategy}
      >
        <ul className="flex flex-col gap-1">
          {channels?.map((channel, i) => (
            <SortableChannel
              key={channel.id}
              channel={channel}
              folderId={folderId}
              teamId={teamId}
              type={type}
              idx={i}
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
  type,
  idx,
}: ChannelProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    activeIndex,
    index,
    overIndex,
    active,
  } = useSortable({
    id: channel.id,
    data: {
      type,
      folderId,
      teamId,
      idx,
    },
  });

  const isSomethingOver = index === overIndex;
  const isChannelOver = active?.data?.current?.type === type;

  const isAbove = activeIndex > overIndex;
  const isBelow = activeIndex < overIndex;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      {...listeners}
      {...attributes}
      className={cn(
        // "border-b-2 border-t-2 border-b-transparent border-t-transparent",
        isSomethingOver && isChannelOver && isAbove && "border-t-blue-400",
        isSomethingOver && isChannelOver && isBelow && "border-b-blue-400",
      )}
    >
      <Channel
        channel={channel}
        activeIndex={activeIndex}
        isDragging={isDragging}
        type={type}
        ref={setNodeRef}
      />
    </div>
  );
}

interface DraggableProps {
  activeIndex?: number;
  isDragging: boolean;
  type: ChannelsTypes;
}

export const Channel = React.forwardRef<
  HTMLLIElement,
  { channel: DrObj<ChannelType> } & DraggableProps &
    React.HTMLAttributes<HTMLLIElement>
>(({ channel, activeIndex, isDragging, type, ...props }, ref) => {
  const { workspaceSlug } = useCurrentWorkspace();

  return (
    <li ref={ref} className="group flex grow items-center" {...props}>
      <SidebarItem
        aria-disabled={isDragging}
        Icon={FileText}
        href={`/${workspaceSlug}/${type}/${channel.id}`}
      >
        <span className="select-none truncate">{channel.name}</span>
        <SidebarItemBtn
          Icon={MoreHorizontal}
          className="-my-1 ml-auto"
          onClick={() => {}}
        />
      </SidebarItem>
    </li>
  );
});

Channel.displayName = "Channel";

import * as React from "react";

import { SidebarItem } from "./sidebar-item";

import { SidebarItemBtn } from "./sidebar-item-btn";
import { ChannelsTypes, DrObj, Team } from "@repo/data";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Folders } from "./folders";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TeamMore } from "./team-more";
import { Channels } from "./channels";
import { TeamThreadsMore } from "./team-threads-more";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useIsTeamMember } from "@/hooks/use-is-team-member";
import { SafeAvatar } from "@/components/safe-avatar";
import { activeSidebarAtom, openTeamsAtom } from "./sidebar-atoms";
import { useIsTeamModerator } from "@/hooks/use-is-team-moderator";
import { ChevronDown, ChevronRight } from "lucide-react";
import { TeamRoomsMore } from "./team-rooms-more";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { isSidebarOpenAtom } from "@/store/global-atoms";

interface TeamspacesProps {
  isPages?: boolean;
  type: ChannelsTypes;
}

interface TeamspaceProps extends TeamspacesProps {
  team: DrObj<Team>;
  idx: number;
}

export function Teamspaces({ isPages = false, type }: TeamspacesProps) {
  const { structure } = useCurrentWorkspace();

  const teamsId = useMemo(
    () => structure.teams?.map((t) => t.id) || [],
    [structure.teams],
  );

  return (
    <div className="h-full min-h-full shrink-0">
      <SortableContext items={teamsId} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-2">
          {structure.teams?.map((team, i) => (
            <li key={team.id}>
              <SortableTeamspace
                team={team}
                idx={i}
                type={type}
                isPages={isPages}
              />
            </li>
          ))}
        </ul>
      </SortableContext>
    </div>
  );
}

// Teamspace
function SortableTeamspace({
  team,
  idx,
  isPages = false,
  type,
}: TeamspaceProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    activeIndex,
    overIndex,
    active,
    index,
  } = useSortable({
    id: team.id,
    data: {
      type: "team",
      idx,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSomethingOver = index === overIndex;
  const isTeamOver = active?.data?.current?.type === "team";

  const [openTeams, setOpenTeams] = useAtom(openTeamsAtom);

  const isOpen = !!openTeams[team.id];

  const isChannelOver =
    active?.data?.current?.type === "channel" &&
    active?.data?.current?.teamId !== team.id;

  const isFolderOver =
    active?.data?.current?.type === "folder" &&
    active?.data?.current?.teamId !== team.id;

  const isChanFoldOver = isSomethingOver && (isChannelOver || isFolderOver);

  const isAbove = activeIndex > overIndex;
  const isBelow = activeIndex < overIndex;

  const isTeamMemberOrModerator = useIsTeamMember(team.id);

  const isTeamModerator = useIsTeamModerator();

  if (!isTeamMemberOrModerator) return null;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(o) => {
        setOpenTeams((prev) => ({ ...prev, [team.id]: o }));
      }}
    >
      <CollapsibleTrigger asChild>
        <div
          className={cn(
            // "border-b-2 border-b-blue-200 -py-2",
            isSomethingOver && isOpen && isChanFoldOver && "border-b-blue-400",
          )}
          role="button"
          aria-label={team?.name}
        >
          <Teamspace
            isMod={isTeamModerator}
            team={team}
            type={type}
            isChanFoldOver={isChanFoldOver}
            isDragging={isDragging}
            ref={setNodeRef}
          />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent
        className={cn("py-1 pl-4", type === "resources" && "hidden")}
      >
        <div className="border-l border-border p-0 pl-2.5">
          {/* <Separator orientation="vertical" className="bg-yellow-300" /> */}

          {isPages && <Folders teamId={team.id} folders={team.folders} />}
          {!isPages && (
            <>
              {type === "room" && (
                <Channels type="room" teamId={team.id} channels={team.rooms} />
              )}

              {type === "thread" && (
                <Channels
                  type="thread"
                  teamId={team.id}
                  channels={team.threads}
                />
              )}
            </>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface DraggableProps {
  isChanFoldOver?: boolean;
  isDragging: boolean;
  type: ChannelsTypes;
  isMod: boolean;
}

export const Teamspace = React.forwardRef<
  HTMLDivElement,
  { team: DrObj<Team> } & DraggableProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    { team, isChanFoldOver, type, isMod = false, isDragging, ...props },
    ref,
  ) => {
    const { teamId } = useParams<{ teamId?: string }>();
    const { workspaceSlug } = useCurrentWorkspace();
    const activeSideBar = useAtomValue(activeSidebarAtom);
    const activeChan = usePathname().split("/").at(2) || "home";
    const isDesktop = useIsDesktop();
    const router = useRouter();
    const setIsSidebarOpen = useSetAtom(isSidebarOpenAtom);

    return (
      <div ref={ref} className="group flex grow" {...props}>
        <SidebarItem
          aria-disabled={isDragging}
          isActive={
            isChanFoldOver ||
            (team.id === teamId && activeSideBar === activeChan)
          }
          noIcon
          {...(type === "resources" && {
            onClick: () => {
              if (!isDesktop) setIsSidebarOpen(false);
              router.push(`/${workspaceSlug}/resources/${team.id}`);
            },
          })}
          className="group/collapsible"
        >
          <div className="relative -ml-0.5 mr-2 h-5 w-5 ">
            <SidebarItemBtn
              className={cn(
                "invisible absolute p-0.5 transition-transform",

                type !== "resources" &&
                  "group-hover/collapsible:visible group-aria-expanded/collapsible:rotate-90",
              )}
              Icon={ChevronRight}
            />
            <SafeAvatar
              className={cn(
                "absolute left-0 top-0 h-5 w-5 shrink-0 rounded-md ",

                type !== "resources" && "group-hover/collapsible:invisible",
              )}
              fallbackClassName="select-none rounded-md text-xs uppercase"
              fallback={team.name}
              src={team.avatar}
            />
          </div>

          <span className="select-none truncate">{team.name}</span>

          {isMod && (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="ml-auto"
            >
              {type === "page" && <TeamMore teamId={team.id} />}
              {type === "room" && <TeamRoomsMore teamId={team.id} />}
              {type === "thread" && <TeamThreadsMore teamId={team.id} />}
            </div>
          )}
        </SidebarItem>
      </div>
    );
  },
);

// Teamspace.displayName = "Teamspace";

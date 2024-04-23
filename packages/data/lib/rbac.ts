import exp from "constants";
import {
  WorkspaceMembers,
  WorkspaceStructure,
} from "../schemas/workspace.schema";
import { ChannelsTypes } from "../schemas/channel.schema";
import { DrObj } from "..";

interface Common {
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
  userId?: string;
  teamId?: string;
}

interface Membership {
  members: WorkspaceMembers | DrObj<WorkspaceMembers>;
  userId?: string;
}

// isTeamMember
export function isTeamMember({ structure, userId = "", teamId }: Common) {
  return !!structure.teams
    .find((t) => t.id === teamId)
    ?.members.includes(userId);
}

// isAdmin
export function isAdmin({ members, userId }: Membership) {
  return members.members.find((m) => m.id === userId)?.role === "admin";
}

// isTeamModerator
export function isTeamModerator({
  structure,
  userId = "",
  teamId = "",
}: Common) {
  return !!structure.teams
    .find((t) => t.id === teamId)
    ?.moderators.includes(userId);
}

// canEdit
export function canEdit({
  members,
  structure,
  userId = "",
  teamId = "",
  channelId = "",
  channelType = "page",
  folderId,
}: Common &
  Membership & {
    folderId?: string;
    channelId?: string;
    channelType?: ChannelsTypes;
  }) {
  const team = structure.teams.find((t) => t.id === teamId);

  const channel =
    channelType === "page"
      ? team?.folders
          .find((f) => f.id === folderId)
          ?.channels.find((c) => c.id === channelId)
      : channelType === "room"
        ? team?.rooms.find((r) => r.id === channelId)
        : team?.threads.find((t) => t.id === channelId);

  if (channel?.editGroups?.includes("team-members"))
    return isTeamMember({ structure, userId, teamId });

  const editGroups = channel?.editGroups
    .map((g) => structure.groups.find((gr) => gr.id === g)?.members)
    .flat();

  return (
    !!editGroups?.includes(userId) ||
    isTeamModerator({ structure, userId, teamId })
  );
}

// canView
export function canView({
  members,
  structure,
  userId = "",
  teamId = "",
  channelId = "",
  channelType = "page",
  folderId,
}: Common &
  Membership & {
    folderId?: string;
    channelId: string;
    channelType: ChannelsTypes;
  }) {
  const team = structure.teams.find((t) => t.id === teamId);
  const channel =
    channelType === "page"
      ? team?.folders
          .find((f) => f.id === folderId)
          ?.channels.find((c) => c.id === channelId)
      : channelType === "room"
        ? team?.rooms.find((r) => r.id === channelId)
        : team?.threads.find((t) => t.id === channelId);

  if (channel?.viewGroups?.includes("team-members"))
    return isTeamMember({ structure, userId, teamId });

  const viewGroups = channel?.viewGroups
    .map((g) => structure.groups.find((gr) => gr.id === g)?.members)
    .flat();

  return (
    !!viewGroups?.includes(userId) ||
    isTeamModerator({ structure, userId, teamId })
  );
}

export function isOwner({ members, userId }: Membership) {
  return members.members.find((m) => m.id === userId)?.role === "owner";
}

import { nanoid } from "nanoid";
import {
  TEAM_MEMBERS_ROLE,
  WORKSPACE_TEAM_ID_LENGTH,
} from "../../schemas/config";
import { Folder, Team } from "../../schemas/team.schema";
import {
  Invite,
  Member,
  NewInvite,
  WorkspaceMembers,
  WorkspaceStructure,
} from "../../schemas/workspace.schema";

export const createRootFolder = (teamId: string): Folder => ({
  name: "root",
  channels: [],
  id: "root-" + teamId,
  editGroups: [TEAM_MEMBERS_ROLE],
  viewGroups: [TEAM_MEMBERS_ROLE],
});

export const createDefaultTeam = (createdBy: string): Team => {
  const teamId = nanoid(WORKSPACE_TEAM_ID_LENGTH);
  return {
    id: teamId,
    name: "General",
    slug: "general",
    avatar: "",
    moderators: [],
    members: [createdBy],
    createdBy: createdBy,
    default: true,
    folders: [createRootFolder(teamId)],
    threads: [],
    rooms: [],
    tags: [],
  };
};

export function defaultWorkspaceMembers(): WorkspaceMembers {
  return {
    createdBy: "",
    members: [],
  };
}

export function defaultWorkspaceStructure(): WorkspaceStructure {
  return {
    teams: [],
    groups: [],
  };
}

export const addWorkspaceMember = (
  userId: string,
  role: Member["role"],
  invite: Invite
) => ({
  id: userId,
  role,
  joinInfo: {
    joinedAt: new Date().toISOString(),
    token: invite.token,
    createdBy: invite.createdBy,
    method: invite.method,
  },
});

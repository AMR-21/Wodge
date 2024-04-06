import { nanoid } from "nanoid";
import {
  BRAND_COLOR,
  Channel,
  Group,
  TEAM_MEMBERS_ROLE,
  Team,
  WORKSPACE_TEAM_ID_LENGTH,
  WorkspaceStructure,
} from "..";
import { UserId } from "./tests";

export function createTestTeam(data?: Partial<Team>) {
  const newTeam: Team = {
    createdBy: UserId,
    folders: [
      {
        name: "root",
        channels: [],
        id: "root",
        editGroups: [TEAM_MEMBERS_ROLE],
        viewGroups: [TEAM_MEMBERS_ROLE],
      },
    ],
    id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
    members: [],
    name: "Test Team",
    tags: [],
    moderators: [],
    ...data,
  };
  return newTeam;
}

export function createTestRole(data?: Partial<Group>) {
  const newTeam: Group = {
    createdBy: UserId,
    id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
    members: [],
    name: "Test Team",
    color: BRAND_COLOR,
    ...data,
  };
  return newTeam;
}

export function createTestChannel(data?: Partial<Channel>) {
  const channel: Channel = {
    id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
    name: "Test Channel",
    type: "text",
    avatar: "",
    editGroups: [],
    viewGroups: [],
    ...data,
  };
  return channel;
}

export function createTestStructure(data?: Partial<WorkspaceStructure>) {
  const structure: WorkspaceStructure = {
    teams: [],
    groups: [],
    tags: [],
    ...data,
  };
  return structure;
}

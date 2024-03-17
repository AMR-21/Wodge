import { nanoid } from "nanoid";
import {
  BRAND_COLOR,
  Channel,
  Role,
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
        editRoles: [TEAM_MEMBERS_ROLE],
        viewRoles: [TEAM_MEMBERS_ROLE],
      },
    ],
    id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
    members: [],
    name: "Test Team",
    tags: [],
    ...data,
  };
  return newTeam;
}

export function createTestRole(data?: Partial<Role>) {
  const newTeam: Role = {
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
    editRoles: [],
    viewRoles: [],
    ...data,
  };
  return channel;
}

export function createTestStructure(data?: Partial<WorkspaceStructure>) {
  const structure: WorkspaceStructure = {
    teams: [],
    roles: [],
    tags: [],
    ...data,
  };
  return structure;
}

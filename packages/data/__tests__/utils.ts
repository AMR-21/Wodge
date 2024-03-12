import { nanoid } from "nanoid";
import {
  BRAND_COLOR,
  Role,
  Team,
  WORKSPACE_TEAM_ID_LENGTH,
  WorkspaceStructure,
} from "..";
import { UserId } from "../tests";

export function createTestTeam(data?: Partial<Team>) {
  const newTeam: Team = {
    createdBy: UserId,
    dirs: [{ name: "root", channels: [], id: "root" }],
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
    linkedTeams: [],
    permissions: [],
    ...data,
  };
  return newTeam;
}

export function createTestStructure(data?: Partial<WorkspaceStructure>) {
  const structure: WorkspaceStructure = {
    teams: [],
    publicChannels: [],
    roles: [],
    tags: [],
    ...data,
  };
  return structure;
}

import { nanoid } from "nanoid";
import {
  BRAND_COLOR,
  Channel,
  Group,
  ID_LENGTH,
  TEAM_MEMBERS_ROLE,
  Team,
  Thread,
  WORKSPACE_TEAM_ID_LENGTH,
  WorkspaceMembers,
  WorkspaceStructure,
  ThreadMessage,
} from "..";
import { UserId } from "./tests";

export function createTestThread (data?: Partial<Thread>) {
  const newThread: Thread = {
    id: nanoid(ID_LENGTH),
    name: "Test Thread",
    editGroups: [TEAM_MEMBERS_ROLE],
    viewGroups: [TEAM_MEMBERS_ROLE],
    ...data
  }
  return newThread
  
}
export function createThreadMessage (data?: Partial<ThreadMessage>) {
  const newThreadMessage: ThreadMessage = {
    id: nanoid(ID_LENGTH),
    author: UserId,
    content: "Test Message",
    ...data
  }
  return newThreadMessage
}

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
    rooms: [],
    default: false,
    threads: [],
    slug: "test-team",
    tags: [],
    moderators: [],
    ...data,
  };
  return newTeam;
}

export function createTestGroup(data?: Partial<Group>) {
  const newGroup: Group = {
    createdBy: UserId,
    id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
    members: [],
    name: "Test group",
    color: BRAND_COLOR,
    ...data,
  };
  return newGroup;
}

export function createTestChannel(data?: Partial<Channel>) {
  const channel: Channel = {
    id: nanoid(ID_LENGTH),
    name: "Test Channel",
    avatar: "",
    editGroups: ["team-members"],
    viewGroups: ["team-members"],
    ...data,
  };
  return channel;
}

export function createTestStructure(data?: Partial<WorkspaceStructure>) {
  const structure: WorkspaceStructure = {
    teams: [],
    groups: [],

    ...data,
  };
  return structure;
}

export function createTestMembers(data?: Partial<WorkspaceMembers>) {
  const members: WorkspaceMembers = {
    members: [
      {
        id: UserId,
        role: "owner",
        joinInfo: {
          createdBy: "",
          joinedAt: new Date().toISOString(),
          method: "email",
          token: "",
        },
      },
    ],
    createdBy: UserId,
    ...data,
  };
  return members;
}

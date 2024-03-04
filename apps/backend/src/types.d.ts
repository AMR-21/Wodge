import {
  UserWorkspacesStore,
  WorkspaceMembers,
  WorkspaceStructure,
  WorkspaceType,
} from "@repo/data";
import WorkspaceParty from "./workspace/workspace-party";

/**
 * General
 */
interface Party {
  versions: Versions;
}

interface ReplicacheFields {
  lastModifiedVersion: number;
  deleted: boolean;
}

export type Versions = Map<string, number | boolean>;

/**
 * User
 */
export type ServerWorkspacesStore = {
  data: UserWorkspacesStore;
} & ReplicacheFields;

export interface UserPartyInterface extends Party {
  workspacesStore: ServerWorkspacesStore;
}

/**
 * Workspace
 */
export type ServerWorkspaceData = { data: WorkspaceType } & ReplicacheFields;

export type ServerWorkspaceMembers = {
  data: WorkspaceMembers;
} & ReplicacheFields;

export type ServerWorkspaceStructure = {
  data: WorkspaceStructure;
} & ReplicacheFields;

export type PresenceMap = Map<string, boolean>;
export interface WorkspacePartyInterface extends Party {
  workspaceMetadata: ServerWorkspaceData;
  workspaceMembers: ServerWorkspaceMembers;
  workspaceStructure: ServerWorkspaceStructure;
  presenceMap: PresenceMap;
}

import {
  UserWorkspacesStore,
  WorkspaceMembers,
  WorkspaceStructure,
  WorkspaceType,
} from "@repo/data/schemas";
import WorkspaceParty from "./workspace/workspace-party";

/**
 * General
 */
interface Party {
  versions: Map<string, number>;
}

interface ReplicacheFields {
  lastModifiedVersion: number;
  deleted: boolean;
}

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
export interface WorkspacePartyInterface extends Party {
  workspaceMetadata: ServerWorkspaceData;
  workspaceMembers: ServerWorkspaceMembers;
  workspaceStructure: ServerWorkspaceStructure;
}

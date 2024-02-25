import { WorkspaceMetadata } from "@repo/data/schemas";

interface Party {
  versions: Map<string, number>;
}

export interface UserPartyInterface extends Party {
  workspacesStore: UserWorkspacesStore;
}

export interface WorkspacePartyInterface extends Party {
  workspaceMetadata: WorkspaceMetadata;
}

import { DrObj, WorkspaceStructure } from "../../..";

interface WorkspaceTeamMutation {
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
  teamId: string;
}

interface WorkspaceGroupMutation {
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
  groupId: string;
}

interface WorkspaceChannelMutation {
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
  channelId: string;
  folderId: string;
  teamId: string;
}

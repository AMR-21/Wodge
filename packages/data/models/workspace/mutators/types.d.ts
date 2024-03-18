import { DrObj, WorkspaceStructure } from "../../..";

interface WorkspaceTeamMutation {
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
  teamId: string;
}

interface WorkspaceRoleMutation {
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
  roleId: string;
}

interface WorkspaceChannelMutation {
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
  channelId: string;
  folderId: string;
  teamId: string;
}

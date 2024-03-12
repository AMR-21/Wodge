import { DrObj, WorkspaceStructure } from "../../..";

interface WorkspaceTeamMutation {
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
  teamId: string;
}

interface WorkspaceRoleMutation {
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
  roleId: string;
}

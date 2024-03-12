import { DrObj, WorkspaceStructure } from "../../..";

interface WorkspaceTeamMutation {
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
  teamId: string;
}

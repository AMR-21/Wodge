import { DrObj } from "../../..";
import { Channel, WorkspaceStructure } from "../../../schemas/workspace.schema";

interface CreateTeamArgs {
  channel: Channel;
  teamId: string;
  dirId: string;
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function createChannelMutation({
  channel,
  dirId,
  teamId,
  structure,
}: CreateTeamArgs) {}

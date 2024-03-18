import { deleteTeamMutation } from "@repo/data/models/workspace/mutators/delete-team";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import { makeWorkspaceStructureKey } from "@repo/data";

export async function deleteTeam(party: WorkspaceParty, params: RunnerParams) {
  party.workspaceStructure.data = deleteTeamMutation({
    structure: party.workspaceStructure.data,
    teamId: params.mutation.args as string,
  });

  party.workspaceStructure.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put(
    makeWorkspaceStructureKey(),
    party.workspaceStructure
  );
}

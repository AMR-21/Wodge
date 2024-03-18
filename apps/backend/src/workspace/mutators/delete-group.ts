import { deleteGroupMutation } from "@repo/data/models/workspace/mutators/delete-group";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import { makeWorkspaceStructureKey } from "@repo/data";

export async function deleteGroup(party: WorkspaceParty, params: RunnerParams) {
  party.workspaceStructure.data = deleteGroupMutation({
    structure: party.workspaceStructure.data,
    groupId: params.mutation.args as string,
  });

  party.workspaceStructure.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put(
    makeWorkspaceStructureKey(),
    party.workspaceStructure
  );
}

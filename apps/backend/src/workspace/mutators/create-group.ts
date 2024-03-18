import { createGroupMutation } from "@repo/data/models/workspace/mutators/create-group";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import { Group, makeWorkspaceStructureKey } from "@repo/data";

export async function createGroup(party: WorkspaceParty, params: RunnerParams) {
  party.workspaceStructure.data = createGroupMutation({
    currentUserId: params.userId,
    structure: party.workspaceStructure.data,
    group: params.mutation.args as Group,
  });

  party.workspaceStructure.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put(
    makeWorkspaceStructureKey(),
    party.workspaceStructure
  );
}

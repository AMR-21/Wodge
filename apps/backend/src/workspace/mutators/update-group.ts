import { groupUpdateRunner } from "@repo/data/models/workspace/mutators/group-update-runner";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import { WorkspaceStructure, makeWorkspaceStructureKey } from "@repo/data";
import { GroupUpdateArgs } from "@repo/data/models/workspace/workspace-mutators";

export async function updateGroup(party: WorkspaceParty, params: RunnerParams) {
  try {
    const { groupId, groupUpdate } = params.mutation.args as GroupUpdateArgs;

    const curMembers = party.workspaceMembers.data.members.map((m) => m.id);

    party.workspaceStructure.data = groupUpdateRunner({
      structure: party.workspaceStructure.data,
      groupUpdate,
      groupId,
      curMembers,
    }) as WorkspaceStructure;

    party.workspaceStructure.lastModifiedVersion = params.nextVersion;

    await party.room.storage.put(
      makeWorkspaceStructureKey(),
      party.workspaceStructure
    );
  } catch (e) {
    return;
  }
}

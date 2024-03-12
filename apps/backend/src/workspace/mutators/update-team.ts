import {
  TeamUpdate,
  teamUpdateRunner,
} from "@repo/data/models/workspace/mutators/team-update-runner";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import { WorkspaceStructure, makeWorkspaceStructureKey } from "@repo/data";
import { TeamUpdateArgs } from "@repo/data/models/workspace/workspace-mutators";

export async function updateTeam(party: WorkspaceParty, params: RunnerParams) {
  try {
    const { teamId, teamUpdate } = params.mutation.args as TeamUpdateArgs;

    const curMembers = party.workspaceMembers.data.members.map((m) => m.id);

    party.workspaceStructure.data = teamUpdateRunner({
      structure: party.workspaceStructure.data,
      teamUpdate,
      teamId,
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

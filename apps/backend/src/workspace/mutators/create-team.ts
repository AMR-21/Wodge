import WorkspaceParty from "../workspace-party";
import { createTeamMutation } from "@repo/data/models/workspace/mutators/create-team";
import { RunnerParams } from "../../lib/replicache";
import { Team, makeWorkspaceStructureKey } from "@repo/data";
import { PushAuth } from "../handlers/workspace-push";

export async function createTeam(
  party: WorkspaceParty,
  params: RunnerParams,
  auth: PushAuth
) {
  if (!auth.isOwnerOrAdmin) return;
  party.workspaceStructure.data = createTeamMutation({
    currentUserId: params.userId,
    structure: party.workspaceStructure.data,
    team: params.mutation.args as Team,
  });

  party.workspaceStructure.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put(
    makeWorkspaceStructureKey(),
    party.workspaceStructure
  );
}

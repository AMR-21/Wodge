import { NewThreadArgs } from "@repo/data/models/workspace/workspace-mutators";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import { makeWorkspaceStructureKey } from "@repo/data";
import { createThreadMutation } from "@repo/data/models/workspace/mutators/create-thread";
import { PushAuth } from "../handlers/workspace-push";

export async function createThread(
  party: WorkspaceParty,
  params: RunnerParams,
  auth: PushAuth
) {
  if (!auth.isOwnerOrAdmin && !auth.isTeamModerator) return;

  const { teamId, ...thread } = params.mutation.args as NewThreadArgs;

  party.workspaceStructure.data = createThreadMutation({
    curUserId: params.userId,
    structure: party.workspaceStructure.data,
    teamId,
    thread,
  });

  party.workspaceStructure.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put(
    makeWorkspaceStructureKey(),
    party.workspaceStructure
  );
}

import { NewThreadArgs } from "@repo/data/models/workspace/workspace-mutators";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import { makeWorkspaceStructureKey } from "@repo/data";
import { createThreadMutation } from "@repo/data/models/workspace/mutators/create-thread";

export async function createThread(
  party: WorkspaceParty,
  params: RunnerParams
) {
  const { teamId, ...thread } = params.mutation.args as NewThreadArgs;

  if (!teamId || !thread) return;

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

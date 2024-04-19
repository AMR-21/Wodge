import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import { makeWorkspaceStructureKey } from "@repo/data";
import { toggleThreadMutation } from "@repo/data/models/workspace/mutators/toggle-thread";

export async function toggleThread(
  party: WorkspaceParty,
  params: RunnerParams
) {
  const { teamId, threadId } = params.mutation.args as {
    teamId: string;
    threadId: string;
  };

  if (!teamId || !threadId) return;

  party.workspaceStructure.data = toggleThreadMutation({
    structure: party.workspaceStructure.data,
    teamId,
    threadId,
  });

  party.workspaceStructure.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put(
    makeWorkspaceStructureKey(),
    party.workspaceStructure
  );
}

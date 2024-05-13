import { RunnerParams } from "@/lib/replicache";
import WorkspaceParty from "../workspace-party";
import { PushAuth } from "../handlers/workspace-push";
import { voteMutation } from "@repo/data/models/workspace/mutators/vote";
import { VoteArgs } from "@repo/data/models/workspace/workspace-mutators";
import { makeWorkspaceStructureKey } from "@repo/data";
import { removeVoteMutation } from "@repo/data/models/workspace/mutators/remove-vote";

export async function removeVote(
  party: WorkspaceParty,
  params: RunnerParams,
  auth: PushAuth
) {
  const vote = params.mutation.args as VoteArgs;

  party.workspaceStructure.data = removeVoteMutation({
    curUserId: params.userId,
    structure: party.workspaceStructure.data,
    ...vote,
  });

  party.workspaceStructure.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put(
    makeWorkspaceStructureKey(),
    party.workspaceStructure
  );
}

import WorkspaceParty from "../workspace-party";
import { RunnerParams } from "../../lib/replicache";
import { Channel, makeWorkspaceStructureKey } from "@repo/data";
import { createPageMutation } from "@repo/data/models/workspace/mutators/create-page";
import { NewPageArgs } from "@repo/data/models/workspace/workspace-mutators";
import { PushAuth } from "../handlers/workspace-push";
import { produce } from "immer";

export async function createPage(
  party: WorkspaceParty,
  params: RunnerParams,
  auth: PushAuth
) {
  if (!auth.isOwnerOrAdmin && !auth.isTeamModerator) return;

  const { folderId, teamId, ...page } = params.mutation.args as NewPageArgs;

  if (!folderId || !teamId || !page) return;

  const newStructure = createPageMutation({
    structure: party.workspaceStructure.data,
    folderId,
    teamId,
    page,
  });

  party.workspaceStructure = produce(party.workspaceStructure, (draft) => {
    draft.data = newStructure;
    draft.lastModifiedVersion = params.nextVersion;
  });

  await party.room.storage.put(
    makeWorkspaceStructureKey(),
    party.workspaceStructure
  );
}

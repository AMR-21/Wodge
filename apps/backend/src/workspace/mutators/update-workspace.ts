import { WorkspaceUpdateArgs } from "@repo/data/models/workspace/workspace-mutators";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import { updateWorkspaceInfoMutation } from "@repo/data/models/workspace/mutators/workspace-info";
import { Workspace, makeWorkspaceKey } from "@repo/data";

export async function updateWorkspace(
  party: WorkspaceParty,
  params: RunnerParams
) {
  try {
    const { update } = params.mutation.args as WorkspaceUpdateArgs;

    party.workspaceMetadata.data = updateWorkspaceInfoMutation({
      workspace: party.workspaceMetadata.data,
      update,
    }) as Workspace;

    party.workspaceMetadata.lastModifiedVersion = params.nextVersion;

    await party.room.storage.put(makeWorkspaceKey(), party.workspaceMetadata);
  } catch (e) {
    return;
  }
}

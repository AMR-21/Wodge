import { deleteChannelMutation } from "@repo/data/models/workspace/mutators/delete-channel";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import { makeWorkspaceStructureKey } from "@repo/data";
import { DeleteChannelArgs } from "@repo/data/models/workspace/workspace-mutators";

export async function deleteChannel(
  party: WorkspaceParty,
  params: RunnerParams
) {
  const args = params.mutation.args as DeleteChannelArgs;
  party.workspaceStructure.data = deleteChannelMutation({
    structure: party.workspaceStructure.data,
    channelId: args.channelId,
    folderId: args?.folderId,
    teamId: args.teamId,
    type: args.type,
  });

  party.workspaceStructure.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put(
    makeWorkspaceStructureKey(),
    party.workspaceStructure
  );
}

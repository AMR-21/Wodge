import WorkspaceParty from "../workspace-party";
import { createChannelMutation } from "@repo/data/models/workspace/mutators/create-channel";
import { RunnerParams } from "../../lib/replicache";
import { Channel, makeWorkspaceStructureKey } from "@repo/data";
import { NewChannelArgs } from "@repo/data/models/workspace/workspace-mutators";

export async function createChannel(
  party: WorkspaceParty,
  params: RunnerParams
) {
  const { folderId, teamId, ...channel } = params.mutation
    .args as NewChannelArgs;

  if (!folderId || !teamId || !channel) return;

  party.workspaceStructure.data = createChannelMutation({
    structure: party.workspaceStructure.data,
    folderId,
    teamId,
    channel: channel as Channel,
  });

  party.workspaceStructure.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put(
    makeWorkspaceStructureKey(),
    party.workspaceStructure
  );
}

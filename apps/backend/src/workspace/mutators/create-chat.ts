import { NewChatArgs } from "@repo/data/models/workspace/workspace-mutators";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import { makeWorkspaceStructureKey } from "@repo/data";
import { createChatMutation } from "@repo/data/models/workspace/mutators/create-chat";

export async function createChat(party: WorkspaceParty, params: RunnerParams) {
  const { teamId, ...chat } = params.mutation.args as NewChatArgs;

  if (!teamId || !chat) return;

  party.workspaceStructure.data = createChatMutation({
    structure: party.workspaceStructure.data,
    teamId,
    chat,
  });

  party.workspaceStructure.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put(
    makeWorkspaceStructureKey(),
    party.workspaceStructure
  );
}

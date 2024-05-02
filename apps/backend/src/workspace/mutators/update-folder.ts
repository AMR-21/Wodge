import WorkspaceParty from "../workspace-party";
import { RunnerParams } from "../../lib/replicache";
import { makeWorkspaceStructureKey } from "@repo/data";
import {
  NewFolderArgs,
  NewRoomArgs,
  NewThreadArgs,
} from "@repo/data/models/workspace/workspace-mutators";
import { updateRoomMutation } from "@repo/data/models/workspace/mutators/update-room";
import { updateThreadMutation } from "@repo/data/models/workspace/mutators/update-thread";
import { updateFolderMutation } from "@repo/data/models/workspace/mutators/update-folder";

export async function updateFolder(
  party: WorkspaceParty,
  params: RunnerParams
) {
  const { teamId, ...folder } = params.mutation.args as NewFolderArgs;

  if (!teamId || !folder) return;

  party.workspaceStructure.data = updateFolderMutation({
    structure: party.workspaceStructure.data,
    teamId,
    folder,
  });

  party.workspaceStructure.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put(
    makeWorkspaceStructureKey(),
    party.workspaceStructure
  );
}

import WorkspaceParty from "../workspace-party";
import { RunnerParams } from "../../lib/replicache";
import { makeWorkspaceStructureKey } from "@repo/data";
import { NewRoomArgs } from "@repo/data/models/workspace/workspace-mutators";
import { updateRoomMutation } from "@repo/data/models/workspace/mutators/update-room";
import { PushAuth } from "../handlers/workspace-push";

export async function updateRoom(
  party: WorkspaceParty,
  params: RunnerParams,
  auth: PushAuth
) {
  if (!auth.isOwnerOrAdmin && !auth.isTeamModerator) return;

  const { teamId, ...room } = params.mutation.args as NewRoomArgs;

  if (!teamId || !room) return;

  party.workspaceStructure.data = updateRoomMutation({
    structure: party.workspaceStructure.data,
    teamId,
    room,
  });

  party.workspaceStructure.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put(
    makeWorkspaceStructureKey(),
    party.workspaceStructure
  );
}

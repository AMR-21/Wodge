import { NewRoomArgs } from "@repo/data/models/workspace/workspace-mutators";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import { makeWorkspaceStructureKey } from "@repo/data";
import { createRoomMutation } from "@repo/data/models/workspace/mutators/create-room";
import { PushAuth } from "../handlers/workspace-push";

export async function createRoom(
  party: WorkspaceParty,
  params: RunnerParams,
  auth: PushAuth
) {
  if (!auth.isOwnerOrAdmin && !auth.isTeamModerator) return;
  const { teamId, ...room } = params.mutation.args as NewRoomArgs;

  if (!teamId || !room) return;

  party.workspaceStructure.data = createRoomMutation({
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

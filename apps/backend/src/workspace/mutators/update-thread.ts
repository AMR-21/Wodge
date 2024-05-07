import WorkspaceParty from "../workspace-party";
import { RunnerParams } from "../../lib/replicache";
import { makeWorkspaceStructureKey } from "@repo/data";
import {
  NewRoomArgs,
  NewThreadArgs,
} from "@repo/data/models/workspace/workspace-mutators";
import { updateRoomMutation } from "@repo/data/models/workspace/mutators/update-room";
import { updateThreadMutation } from "@repo/data/models/workspace/mutators/update-thread";
import { PushAuth } from "../handlers/workspace-push";

export async function updateThread(
  party: WorkspaceParty,
  params: RunnerParams,
  auth: PushAuth
) {
  const { teamId, ...thread } = params.mutation.args as NewThreadArgs;

  if (!teamId || !thread) return;

  party.workspaceStructure.data = updateThreadMutation({
    structure: party.workspaceStructure.data,
    teamId,
    thread,
    userId: params.userId,
  });

  party.workspaceStructure.lastModifiedVersion = params.nextVersion;

  await party.room.storage.put(
    makeWorkspaceStructureKey(),
    party.workspaceStructure
  );
}

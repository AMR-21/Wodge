import { TeamSchema, makeWorkspaceStructureKey } from "@repo/data";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";

import { produce } from "immer";

export async function deleteWorkspace(
  party: WorkspaceParty,
  { mutation, nextVersion, userId }: RunnerParams
) {
  // 1. validate that initiator of the request is the owner of the workspace
  if (party.workspaceMembers.data.owner !== userId) {
    return;
  }
 // 2. delete the workspace
  await party.room.storage.delete(makeWorkspaceStructureKey());

}
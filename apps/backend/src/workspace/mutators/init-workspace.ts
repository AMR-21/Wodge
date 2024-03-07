import {
  WorkspaceSchema,
  defaultWorkspaceStructure,
  makeWorkspaceKey,
  makeWorkspaceStructureKey,
} from "@repo/data";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";

export async function initWorkspace(
  party: WorkspaceParty,
  { mutation, nextVersion, userId }: RunnerParams
) {
  // 1. validate that initiator of the request is the owner of the workspace
  if (party.workspaceMembers.data.owner !== userId) {
    return;
  }

  // 2. validate the mutation id is 1
  if (mutation.id !== 1) {
    return;
  }

  // 3. validate the data
  const validatedFields = WorkspaceSchema.safeParse(mutation.args);

  if (!validatedFields.success) {
    return;
  }

  const { data: workspaceData } = validatedFields;

  // Validate the target workspace
  if (workspaceData.id !== party.room.id) {
    return;
  }

  // 4. persist the data
  party.workspaceMetadata.data = workspaceData;
  party.workspaceMetadata.lastModifiedVersion = nextVersion;

  // 5. create default workspace structure
  party.workspaceStructure.data = defaultWorkspaceStructure();
  party.workspaceStructure.lastModifiedVersion = nextVersion;

  await party.room.storage.put({
    [makeWorkspaceKey()]: party.workspaceMetadata,
    [makeWorkspaceStructureKey()]: party.workspaceStructure,
  });
}

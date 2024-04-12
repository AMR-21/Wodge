import {
  PublicUserType,
  WorkspaceSchema,
  defaultWorkspaceStructure,
  makeWorkspaceKey,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
} from "@repo/data";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import { produce } from "immer";

export async function initWorkspace(
  party: WorkspaceParty,
  { mutation, nextVersion, userId }: RunnerParams
) {
  // 1. validate that initiator of the request is the owner of the workspace
  if (party.workspaceMembers.data.createdBy !== userId) {
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
  party.workspaceMetadata = produce(party.workspaceMetadata, (draft) => {
    draft.data = workspaceData;
    draft.lastModifiedVersion = nextVersion;
  });

  // 5. create default workspace structure
  party.workspaceStructure = produce(party.workspaceStructure, (draft) => {
    draft.data = {
      tags: [],
      teams: [],
      groups: [],
    };
    draft.lastModifiedVersion = nextVersion;
  });

  party.workspaceMembers = produce(party.workspaceMembers, (draft) => {
    draft.data.members.push({
      id: userId,
      role: "owner",
      joinInfo: {
        joined_at: new Date().toISOString(),
        token: "",
        created_by: "",
        method: "owner",
      },
    });

    draft.lastModifiedVersion = nextVersion;
  });

  await party.room.storage.put({
    [makeWorkspaceKey()]: party.workspaceMetadata,
    [makeWorkspaceMembersKey()]: party.workspaceMembers,
    [makeWorkspaceStructureKey()]: party.workspaceStructure,
  });
}

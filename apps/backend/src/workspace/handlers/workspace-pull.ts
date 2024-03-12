import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { PatcherParams, repPull } from "../../lib/replicache";
import { PatchOperation } from "replicache";
import {
  makeWorkspaceKey,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
} from "@repo/data";

export async function workspacePull(req: Party.Request, party: WorkspaceParty) {
  return await repPull({
    req,
    storage: party.room.storage,
    versions: party.versions,
    patcher: patcher(party),
  });
}

function patcher(party: WorkspaceParty) {
  return async function ({ fromVersion }: PatcherParams) {
    const patch: PatchOperation[] = [];

    const { workspaceMembers, workspaceMetadata, workspaceStructure } = party;

    if (party.workspaceMembers.lastModifiedVersion > fromVersion) {
      patch.push({
        op: "put",
        key: makeWorkspaceMembersKey(),
        value: workspaceMembers.data,
      });
    }

    if (party.workspaceMetadata.lastModifiedVersion > fromVersion) {
      patch.push({
        op: "put",
        key: makeWorkspaceKey(),
        value: workspaceMetadata.data,
      });
    }

    if (party.workspaceStructure.lastModifiedVersion > fromVersion) {
      patch.push({
        op: "put",
        key: makeWorkspaceStructureKey(),
        value: workspaceStructure.data,
      });
    }

    return patch;
  };
}

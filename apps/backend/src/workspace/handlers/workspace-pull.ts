import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { repPull } from "../../lib/replicache";
import { PatchOperation } from "replicache";
import { Versions } from "../../types";
import {
  makeWorkspaceKey,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
} from "@repo/data/keys";

export async function workspacePull(req: Party.Request, party: WorkspaceParty) {
  return await repPull(req, party.room.storage, party.versions, patcher(party));
}

function patcher(party: WorkspaceParty) {
  return async function (fromVersion: number, versions: Versions) {
    const patch: PatchOperation[] = [];

    const { workspaceMembers, workspaceMetadata, workspaceStructure } = party;
    // 1. Get the patched keys
    // if( )

    if (workspaceMembers.lastModifiedVersion > fromVersion) {
      patch.push({
        op: "put",
        key: makeWorkspaceMembersKey(),
        value: workspaceMembers.data,
      });
    }

    if (workspaceMetadata.lastModifiedVersion > fromVersion) {
      patch.push({
        op: "put",
        key: makeWorkspaceKey(party.room.id),
        value: workspaceMetadata.data,
      });
    }

    if (workspaceStructure.lastModifiedVersion > fromVersion) {
      patch.push({
        op: "put",
        key: makeWorkspaceStructureKey(),
        value: workspaceStructure.data,
      });
    }

    console.log(patch);

    return patch;
  };
}

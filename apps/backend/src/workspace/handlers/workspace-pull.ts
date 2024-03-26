import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { PatcherParams, repPull } from "../../lib/replicache";
import { PatchOperation } from "replicache";
import {
  makeWorkspaceKey,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
} from "@repo/data";
import { poke } from "../../user/handlers/poke";

export async function workspacePull(req: Party.Request, party: WorkspaceParty) {
  const userId = req.headers.get("x-user-id")!;
  return await repPull({
    req,
    storage: party.room.storage,
    versions: party.versions,
    patcher: patcher(party, userId),
  });
}

function patcher(party: WorkspaceParty, userId: string) {
  return async function ({ fromVersion }: PatcherParams) {
    const patch: PatchOperation[] = [];

    const { workspaceMembers, workspaceStructure } = party;

    if (party.versions.get("workspaceInfo")! > fromVersion)
      await party.poke({
        type: "workspaceInfo",
        userId,
      });

    if (party.workspaceMembers.lastModifiedVersion > fromVersion) {
      patch.push({
        op: "put",
        key: makeWorkspaceMembersKey(),
        value: workspaceMembers.data,
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

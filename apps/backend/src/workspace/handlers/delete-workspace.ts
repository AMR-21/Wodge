import { removeMemberMutation } from "@repo/data/models/workspace/mutators/remove-member";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import {
  REPLICACHE_VERSIONS_KEY,
  WORKSPACE_INVITES_KEY,
  WORKSPACE_PRESENCE_KEY,
  WorkspaceMembers,
  defaultWorkspaceMembers,
  defaultWorkspaceStructure,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
} from "@repo/data";
import { produce } from "immer";

import * as Party from "partykit/server";
import { ok } from "../../lib/http-utils";

export async function deleteWorkspace(
  req: Party.Request,
  party: WorkspaceParty
) {
  // Update the user party
  const userParty = party.room.context.parties.user!;

  const deletes = party.workspaceMembers.data.members.map((m) =>
    userParty.get(m.id).fetch("/remove-workspace", {
      method: "POST",
      headers: {
        authorization: party.room.env.SERVICE_KEY as string,
      },
      body: JSON.stringify({ workspaceId: party.room.id }),
    })
  );

  // remove from db too

  await Promise.all([
    ...deletes,
    fetch(`${party.room.env.AUTH_DOMAIN}/api/delete-workspace`, {
      method: "POST",
      headers: {
        authorization: party.room.env.SERVICE_KEY as string,
      },
      body: JSON.stringify({ workspaceId: party.room.id }),
    }),
  ]);

  await party.poke({
    type: "deleteWorkspace",
    id: party.room.id,
  });

  party.workspaceMembers = {
    data: { ...defaultWorkspaceMembers() },
    lastModifiedVersion: 0,
    deleted: false,
  };

  party.workspaceStructure = {
    data: { ...defaultWorkspaceStructure() },
    lastModifiedVersion: 0,
    deleted: false,
  };

  party.versions = new Map([
    ["globalVersion", 0],
    ["workspaceInfo", 0],
  ]);
  party.invites = new Map();
  party.presenceMap = new Map();

  await party.room.storage.put({
    [makeWorkspaceMembersKey()]: party.workspaceMembers,
    [makeWorkspaceStructureKey()]: party.workspaceStructure,
    REPLICACHE_VERSIONS_KEY: party.versions,
    WORKSPACE_INVITES_KEY: party.invites,
    WORKSPACE_PRESENCE_KEY: party.presenceMap,
  });

  return ok();
}

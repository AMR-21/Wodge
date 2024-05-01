import { removeMemberMutation } from "@repo/data/models/workspace/mutators/remove-member";
import { RunnerParams } from "../../lib/replicache";
import WorkspaceParty from "../workspace-party";
import {
  REPLICACHE_VERSIONS_KEY,
  WorkspaceMembers,
  makeWorkspaceMembersKey,
} from "@repo/data";
import { produce } from "immer";

import * as Party from "partykit/server";
import { ok } from "../../lib/http-utils";

export async function leaveWorkspace(
  req: Party.Request,
  party: WorkspaceParty
) {
  const memberId = req.headers.get("x-user-id") as string;

  const newState = removeMemberMutation({
    memberId,
    members: party.workspaceMembers.data,
  }) as WorkspaceMembers;

  const globalVersion = party.versions.get("globalVersion") as number;

  party.workspaceMembers = produce(party.workspaceMembers, (draft) => {
    draft.data = newState;
    draft.lastModifiedVersion = globalVersion + 1;
  });

  party.versions.set("globalVersion", globalVersion + 1);
  await party.room.storage.put({
    [makeWorkspaceMembersKey()]: party.workspaceMembers,
    REPLICACHE_VERSIONS_KEY: party.versions,
  });

  // Update the user party
  const userParty = party.room.context.parties.user!;

  const userInstance = userParty.get(memberId);

  // remove from db too

  await Promise.all([
    userInstance.fetch("/remove-workspace", {
      method: "POST",
      headers: {
        authorization: party.room.env.SERVICE_KEY as string,
      },
      body: JSON.stringify({ workspaceId: party.room.id }),
    }),
    fetch(`${party.room.env.AUTH_DOMAIN}/api/remove-member`, {
      method: "POST",
      headers: {
        authorization: party.room.env.SERVICE_KEY as string,
      },
      body: JSON.stringify({ workspaceId: party.room.id, memberId }),
    }),
  ]);

  await party.poke({
    type: "workspaceMembers",
    id: party.room.id,
  });

  return ok();
}

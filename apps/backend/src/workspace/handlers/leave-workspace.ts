import { removeMemberMutation } from "@repo/data/models/workspace/mutators/remove-member";
import WorkspaceParty from "../workspace-party";
import { WorkspaceMembers, makeWorkspaceMembersKey } from "@repo/data";
import { produce } from "immer";

import { ok } from "../../lib/http-utils";
import { Context } from "hono";

export async function leaveWorkspace(party: WorkspaceParty, c: Context) {
  const memberId = c.req.header("x-user-id") as string;

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
    userInstance.fetch("/service/remove-workspace", {
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

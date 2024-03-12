import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { error, ok, unauthorized } from "../../lib/http-utils";
import { PublicUserType } from "@repo/data";
import { REPLICACHE_VERSIONS_KEY, makeWorkspaceMembersKey } from "@repo/data";
import { produce } from "immer";

export async function createWorkspace(
  req: Party.Request,
  party: WorkspaceParty
) {
  // 1. Check that the workspace has not been created i.e no owner
  if (party.workspaceMembers.data.owner !== "") {
    return error("Workspace already exists", 401);
  }

  // 2. add owner to the workspace members as owner and member
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return unauthorized();
  }

  const globalVersion = (party.versions.get("globalVersion") as number) || 0;

  party.workspaceMembers = produce(party.workspaceMembers, (draft) => {
    draft.data.owner = userId;
    draft.lastModifiedVersion = globalVersion + 1;
  });

  // 3. update global version
  party.versions.set("globalVersion", globalVersion + 1);

  // 3. persist updates
  await party.room.storage.put({
    [REPLICACHE_VERSIONS_KEY]: party.versions,
    [makeWorkspaceMembersKey()]: party.workspaceMembers,
  });

  await party.poke();

  return ok();
}

import type * as Party from "partykit/server";
import { badRequest, json, ok, unauthorized } from "../../lib/http-utils";
import WorkspaceParty from "../workspace-party";
import {
  PublicUserType,
  REPLICACHE_VERSIONS_KEY,
  WORKSPACE_INVITE_LINK_KEY,
  makeWorkspaceMembersKey,
} from "@repo/data";
import { getMember, isMemberInWorkspace } from "../../lib/utils";

export async function joinWorkspace(req: Party.Request, party: WorkspaceParty) {
  const token = new URL(req.url).searchParams.get("token");
  const userId = req.headers.get("x-user-id");

  if (!userId) return unauthorized();

  if (!token) return badRequest();

  // 1. validate the token
  const inviteLink = party.inviteLink;

  if (!inviteLink.enabled) {
    return badRequest();
  }

  if (inviteLink.token !== token) {
    return badRequest();
  }

  if (inviteLink.limit === 0) {
    return badRequest();
  }

  // 2. get the user data
  const userData = <PublicUserType>JSON.parse(req.headers.get("x-user-data")!);

  const { id, ...publicData } = userData;

  // 3. check if the user is already a member
  const isMember = isMemberInWorkspace(id, party);

  if (isMember) return badRequest();

  // 4. Add workspace to user data
  const userParty = party.room.context.parties.user!;

  const userInstance = userParty.get(userId);

  const res = await userInstance.fetch("/add-workspace", {
    method: "POST",
    headers: {
      authorization: party.room.env.SERVICE_KEY as string,
    },
    body: JSON.stringify({ workspaceId: party.room.id }),
  });

  if (res.status !== 200) return badRequest();

  // 5. add the user to the workspace
  party.workspaceMembers.data.members.push({
    id,
    data: publicData,
    joinInfo: {
      joined_at: new Date().toISOString(),
      token,
      created_by: inviteLink.createdBy,
    },
    roles: [],
    teams: [],
  });

  // 6. Update Replicache versions
  const nextVersion = party.versions.get("globalVersion")! + 1;

  party.workspaceMembers.lastModifiedVersion = nextVersion;

  party.versions.set("globalVersion", nextVersion);

  // 7. update the invite link
  party.inviteLink.limit -= 1;

  // 8. persist updates
  await party.room.storage.put({
    [makeWorkspaceMembersKey()]: party.workspaceMembers,
    [WORKSPACE_INVITE_LINK_KEY]: party.inviteLink,
    [REPLICACHE_VERSIONS_KEY]: party.versions,
  });

  return json({
    workspaceId: party.room.id,
  });
}

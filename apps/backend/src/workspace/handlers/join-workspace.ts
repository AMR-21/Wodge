import type * as Party from "partykit/server";
import { badRequest, json, ok, unauthorized } from "../../lib/http-utils";
import WorkspaceParty from "../workspace-party";
import {
  Member,
  PublicUserType,
  REPLICACHE_VERSIONS_KEY,
  UserWorkspacesStore,
  WORKSPACE_INVITES_KEY,
  WORKSPACE_PRESENCE_KEY,
  makeWorkspaceMembersKey,
} from "@repo/data";
import { isMemberInWorkspace } from "../../lib/utils";
import { produce } from "immer";

export async function joinWorkspace(req: Party.Request, party: WorkspaceParty) {
  const token = new URL(req.url).searchParams.get("token");
  const userId = req.headers.get("x-user-id");

  if (!userId) return unauthorized();

  if (!token) return badRequest();

  // 1. validate the token
  const invite = party.invites.get(token);

  if (!invite) return badRequest();

  if (invite.limit === 0) {
    return badRequest();
  }

  // 2. get the user data
  const userData = <PublicUserType>JSON.parse(req.headers.get("x-user-data")!);

  // const { id, ...publicData } = userData;

  // 3. check if the user is already a member
  const isMember = isMemberInWorkspace(userData.id, party);

  if (isMember) return badRequest();

  // 4. If the invite method is a email, verify that the requesting user email is included in the invite
  if (invite.method === "email") {
    // if (!invite.emails!.includes(userData.email)) return badRequest();
  }

  // 5. Add workspace to user data
  const userParty = party.room.context.parties.user!;

  const userInstance = userParty.get(userId);

  const res = await userInstance.fetch("/add-workspace", {
    method: "POST",
    headers: {
      authorization: party.room.env.SERVICE_KEY as string,
    },
    body: JSON.stringify({
      workspaceId: party.room.id,
      workspaceName: party.workspaceMetadata.data.name,
      workspaceAvatar: party.workspaceMetadata.data.avatar,
      environment: "cloud",
    } satisfies UserWorkspacesStore),
  });

  if (res.status !== 200) return badRequest();

  // 6. add the user to the workspace
  // TODO add role invitation
  const newMember: Member = {
    id: userId,
    role: "member",
    joinInfo: {
      joined_at: new Date().toISOString(),
      token,
      created_by: invite.createdBy,
      method: invite.method,
    },
  };

  // 7. Update Replicache versions
  const nextVersion = (party.versions.get("globalVersion") as number) + 1;

  party.workspaceMembers = produce(party.workspaceMembers, (draft) => {
    draft.data.members.push(newMember);
    draft.lastModifiedVersion = nextVersion;
  });

  // party.workspaceMembers.lastModifiedVersion = nextVersion;

  party.versions.set("globalVersion", nextVersion);

  // 8. update the invite
  // if(invite.limit !== -1)
  if (invite.method === "link") invite.limit -= 1;

  // if (invite.method === "email")
  //   invite.emails = invite.emails?.filter((email) => email !== userData.email);

  party.invites.set(token, invite);

  // 8. Update presence
  party.presenceMap.set(userData.id, true);

  // 9. persist updates
  await party.room.storage.put({
    [makeWorkspaceMembersKey()]: party.workspaceMembers,
    [WORKSPACE_INVITES_KEY]: party.invites,
    [REPLICACHE_VERSIONS_KEY]: party.versions,
    [WORKSPACE_PRESENCE_KEY]: party.presenceMap,
  });

  // Inform current members of the new user
  await party.poke();

  return json({
    workspaceId: party.room.id,
  });
}

import { badRequest, json, unauthorized } from "../../lib/http-utils";
import WorkspaceParty from "../workspace-party";
import {
  Member,
  REPLICACHE_VERSIONS_KEY,
  WORKSPACE_INVITES_KEY,
  WORKSPACE_PRESENCE_KEY,
  WORKSPACE_STRUCTURE_KEY,
  Workspace,
  addWorkspaceMember,
  makeWorkspaceMembersKey,
} from "@repo/data";
import { isMemberInWorkspace } from "../../lib/utils";
import { produce } from "immer";
import { Context } from "hono";
import queryString from "query-string";

export async function joinWorkspace(party: WorkspaceParty, c: Context) {
  const { token } = queryString.parseUrl(c.req.url).query;
  const userId = c.req.header("x-user-id");

  if (!userId) return unauthorized();

  if (!token || typeof token !== "string") return badRequest();

  // 1. validate the token
  const invite = party.invites.get(token);

  if (!invite) return badRequest();

  if (invite.limit === 0) {
    return badRequest();
  }

  // 3. check if the user is already a member
  const isMember = isMemberInWorkspace(userId, party);

  if (isMember) return badRequest();

  // 4. If the invite method is a email, verify that the requesting user email is included in the invite
  if (invite.method === "email") {
    // if (!invite.emails!.includes(userData.email)) return badRequest();
  }

  // 5. Add user to the workspace in the db
  // Todo use bindings

  const res = await fetch(`${party.room.env.AUTH_DOMAIN}/api/join-workspace`, {
    method: "POST",
    headers: {
      // Accept: "application/json",
      authorization: party.room.env.SERVICE_KEY as string,
      workspaceId: party.room.id,
      userId: userId,
    },
  });

  let workspace: { workspace: Workspace } | undefined;

  try {
    workspace = await res.json();
  } catch (e) {}

  // Todo enhance and check dup slug error
  if (!res.ok) return badRequest();

  // 6. Add workspace to user data

  const userParty = party.room.context.parties.user!;

  const userInstance = userParty.get(userId);

  await userInstance.fetch("/service/add-workspace", {
    method: "POST",
    headers: {
      authorization: party.room.env.SERVICE_KEY as string,
      workspaceId: party.room.id,
    },
  });

  // 7. add the user to the workspace
  // TODO add role invitation
  const newMember: Member = addWorkspaceMember(userId, "member", invite);

  // 8. Update Replicache versions
  const nextVersion = (party.versions.get("globalVersion") as number) + 1;

  party.workspaceMembers = produce(party.workspaceMembers, (draft) => {
    draft.data.members.push(newMember);
    draft.lastModifiedVersion = nextVersion;
  });

  // party.workspaceMembers.lastModifiedVersion = nextVersion;

  party.versions.set("globalVersion", nextVersion);

  // 9. update the invite
  // if(invite.limit !== -1)
  if (invite.method === "link") invite.limit -= 1;

  // if (invite.method === "email")
  //   invite.emails = invite.emails?.filter((email) => email !== userData.email);

  party.invites.set(token, invite);

  // 10. Update presence
  party.presenceMap.set(userId, true);

  party.workspaceStructure = produce(party.workspaceStructure, (draft) => {
    const def = draft.data.teams.find((t) => t.default);

    if (def) {
      def.members.push(userId);
      draft.lastModifiedVersion = nextVersion;
    }
  });

  // 11. persist updates
  await party.room.storage.put({
    [makeWorkspaceMembersKey()]: party.workspaceMembers,
    [WORKSPACE_INVITES_KEY]: party.invites,
    [REPLICACHE_VERSIONS_KEY]: party.versions,
    [WORKSPACE_PRESENCE_KEY]: party.presenceMap,
    [WORKSPACE_STRUCTURE_KEY]: party.workspaceStructure,
  });

  // Inform current members of the new user
  await party.poke();

  return json({
    workspaceId: party.room.id,
    workspaceSlug: workspace?.workspace?.slug,
  });
}

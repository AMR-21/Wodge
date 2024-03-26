import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { badRequest, error, ok, unauthorized } from "../../lib/http-utils";
import {
  defaultWorkspaceStructure,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
  NewWorkspaceSchema,
  REPLICACHE_VERSIONS_KEY,
  Workspace,
  WORKSPACE_TEAM_ID_LENGTH,
} from "@repo/data";
import { produce } from "immer";
import { nanoid } from "nanoid";

export async function createWorkspace(
  req: Party.Request,
  party: WorkspaceParty
) {
  // 1. Check that the workspace has not been created i.e no owner
  if (party.workspaceMembers.data.createdBy !== "") {
    return error("Workspace already exists", 401);
  }

  // 2. add owner to the workspace members as owner and member
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return unauthorized();
  }

  // 3. validate workspace data
  const body = await req.json();

  const validatedFields = NewWorkspaceSchema.safeParse(body);

  if (!validatedFields.success) {
    return error("Invalid workspace data", 401);
  }

  const { data } = validatedFields;

  // 4. create the new workspace in the db and initialize the durable object
  // Todo do it with bindings instead of request

  const newWorkspace: Workspace = {
    ...data,
    owner: userId,
    createdAt: new Date(),
    id: party.room.id,
    avatar: "workspace_avatar_path",
  };

  const res = await fetch(
    `${party.room.env.AUTH_DOMAIN}/api/create-workspace`,
    {
      method: "POST",
      headers: {
        // Accept: "application/json",
        authorization: party.room.env.SERVICE_KEY as string,
      },
      body: JSON.stringify(newWorkspace),
    }
  );

  // Todo enhance and check dup slug error
  if (!res.ok) return badRequest();

  const globalVersion = (party.versions.get("globalVersion") as number) || 0;

  party.workspaceMembers = produce(party.workspaceMembers, (draft) => {
    draft.data.createdBy = userId;
    draft.data.members.push({
      id: userId,
      role: "owner",
      joinInfo: {
        joinedAt: new Date().toISOString(),
        token: "",
        createdBy: "",
        method: "owner",
      },
    });
    draft.lastModifiedVersion = globalVersion + 1;
  });

  party.workspaceStructure = produce(party.workspaceStructure, (draft) => {
    draft.data = defaultWorkspaceStructure();
    draft.data.teams.push({
      id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
      name: "General",
      avatar: "",
      slug: "general",
      chats: [],
      members: [userId],
      createdBy: userId,
      default: true,
      folders: [],
      moderators: [],
      threads: [],
      tags: [],
    });
    draft.lastModifiedVersion = globalVersion + 1;
  });
  // 3. update global version
  party.versions.set("globalVersion", globalVersion + 1);
  party.versions.set("workspaceInfo", globalVersion + 1);

  // 3. persist updates
  await party.room.storage.put({
    [REPLICACHE_VERSIONS_KEY]: party.versions,
    [makeWorkspaceMembersKey()]: party.workspaceMembers,
    [makeWorkspaceStructureKey()]: party.workspaceStructure,
  });

  return ok();
}

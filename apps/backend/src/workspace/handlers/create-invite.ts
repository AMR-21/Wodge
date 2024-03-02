import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import {
  InviteLink,
  InviteLinkSchema,
  REPLICACHE_VERSIONS_KEY,
  Role,
  WORKSPACE_INVITE_LINK_KEY,
  grant,
  makeWorkspaceKey,
} from "@repo/data";
import { nanoid } from "nanoid";
import { badRequest, json, unauthorized } from "../../lib/http-utils";
import { getMember, getRoles, isAllowed, isUserOwner } from "../../lib/utils";

export async function createInvite(req: Party.Request, party: WorkspaceParty) {
  if (!isAllowed(req, party, ["admin"])) return unauthorized();

  const userId = req.headers.get("x-user-id")!;

  const body = <Pick<InviteLink, "limit">>await req.json();

  const newInvite: InviteLink = {
    token: nanoid(),
    limit: body?.limit ?? Infinity,
    enabled: true,
    createdBy: userId,
  };

  const validatedFields = InviteLinkSchema.safeParse(newInvite);

  if (!validatedFields.success) return badRequest();

  const { data } = validatedFields;

  const inviteLink =
    party.room.env.BACKEND_DOMAIN +
    "/parties/workspace/" +
    party.room.id +
    "/join?token=" +
    data.token;

  const nextVersion = party.versions.get("globalVersion")! + 1;
  party.workspaceMetadata.data.inviteLink = inviteLink;

  party.workspaceMetadata.lastModifiedVersion = nextVersion;
  party.versions.set("globalVersion", nextVersion);

  await party.room.storage.put({
    [WORKSPACE_INVITE_LINK_KEY]: data,
    [REPLICACHE_VERSIONS_KEY]: party.versions,
    [makeWorkspaceKey(party.room.id)]: party.workspaceMetadata,
  });

  party.poke();

  return json({
    inviteLink,
    ...data,
  });
}

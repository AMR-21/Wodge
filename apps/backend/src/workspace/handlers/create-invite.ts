import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import {
  InviteLink,
  InviteLinkSchema,
  Role,
  WORKSPACE_INVITE_LINK_KEY,
  grant,
} from "@repo/data";
import { nanoid } from "nanoid";
import { badRequest, json, unauthorized } from "../../lib/http-utils";
import { getMember, getRoles, isUserOwner } from "../../lib/utils";

export async function createInvite(req: Party.Request, party: WorkspaceParty) {
  const userId = req.headers.get("x-user-id");

  if (!userId) return unauthorized();

  const isOwner = isUserOwner(userId, party);

  const requestingMember = getMember(userId, party);

  if (!requestingMember) return unauthorized();

  const roles = getRoles(requestingMember.roles, party);

  if (!roles) return badRequest();

  if (!isOwner && !grant(<Role[]>roles, ["admin"])) return unauthorized();

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

  await party.room.storage.put(WORKSPACE_INVITE_LINK_KEY, data);

  return json({
    inviteLink:
      party.room.env.BACKEND_DOMAIN +
      "/parties/workspace/" +
      party.room.id +
      "/join?token=" +
      data.token,
    ...data,
  });
}

import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { Invite, NewInviteSchema, WORKSPACE_INVITES_KEY } from "@repo/data";
import { nanoid } from "nanoid";
import { badRequest, json, unauthorized } from "../../lib/http-utils";
import { isAllowed } from "../../lib/utils";

export async function createInvite(req: Party.Request, party: WorkspaceParty) {
  if (!isAllowed(req, party, ["admin"])) return unauthorized();

  const userId = req.headers.get("x-user-id")!;

  const body = await req.json();

  const validatedFields = NewInviteSchema.safeParse(body);

  if (!validatedFields.success) return badRequest();

  const {
    data: { limit, method, emails },
  } = validatedFields;

  const newInvite: Invite = {
    createdBy: userId,
    token: nanoid(),
    limit: method === "link" ? limit : Infinity,
    method,
    emails,
  };

  // If method is link, check if there exist and invite link with link method and remove it
  if (method === "link") {
    Object.entries(Object.fromEntries(party.invites)).forEach(
      ([key, value]) => {
        if (value.method === "link") {
          party.invites.delete(key);
        }
      }
    );

    party.invites.set(newInvite.token, newInvite);
  }

  // If method is email, send the emails then add the new invite to the list
  if (method === "email") {
    // Todo: send emails
    party.invites.set(newInvite.token, newInvite);
  }

  await party.room.storage.put({
    [WORKSPACE_INVITES_KEY]: party.invites,
  });

  if (method === "link") {
    const inviteLink =
      party.room.env.BACKEND_DOMAIN +
      "/parties/workspace/" +
      party.room.id +
      "/join?token=" +
      newInvite.token;

    return json({ inviteLink, invites: Object.fromEntries(party.invites) });
  }

  return json({
    invites: Object.fromEntries(party.invites),
  });
}

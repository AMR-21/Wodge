import WorkspaceParty from "../workspace-party";
import { Invite, InviteSchema, WORKSPACE_INVITES_KEY } from "@repo/data";
import { nanoid } from "nanoid";
import { badRequest, json } from "../../lib/http-utils";
import { Context } from "hono";

export async function createInvite(party: WorkspaceParty, c: Context) {
  const userId = c.req.header("x-user-id")!;

  const body = await c.req.json();

  const validatedFields = InviteSchema.safeParse(body);

  if (!validatedFields.success) return badRequest();

  const {
    data: { limit, method },
  } = validatedFields;

  const newInvite: Invite = {
    createdBy: userId,
    token: nanoid(),

    // emails,
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

    await party.poke({
      type: "invite",
    });

    return json({ inviteLink, invites: Object.fromEntries(party.invites) });
  }

  await party.poke({
    type: "invite",
  });

  return json({
    invites: Object.fromEntries(party.invites),
  });
}

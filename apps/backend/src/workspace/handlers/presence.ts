import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { badRequest, ok, unauthorized } from "../../lib/http-utils";
import { PresenceRequestSchema, WORKSPACE_PRESENCE_KEY } from "@repo/data";
import { checkMembership } from "../../lib/auth";

export async function handlePresence(
  req: Party.Request,
  party: WorkspaceParty
) {
  const serviceKey = req.headers.get("Authorization");

  if (serviceKey !== party.room.env.SERVICE_KEY) {
    return unauthorized();
  }

  const body = await req.json();

  const validatedFields = PresenceRequestSchema.safeParse(body);

  if (!validatedFields.success) {
    return badRequest();
  }

  const {
    data: { userId, connect },
  } = validatedFields;

  const isMember = checkMembership(userId, party);

  if (!isMember) {
    return unauthorized();
  }

  if (connect) {
    party.presenceMap.set(userId, true);
  } else {
    party.presenceMap.delete(userId);
  }

  await party.room.storage.put(WORKSPACE_PRESENCE_KEY, party.presenceMap);

  return ok();
}

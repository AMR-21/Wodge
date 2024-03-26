import type * as Party from "partykit/server";
import WorkspaceParty from "../workspace-party";
import { REPLICACHE_VERSIONS_KEY, WorkspaceSchema } from "@repo/data";
import { badRequest, ok } from "../../lib/http-utils";

export async function updateWorkspace(
  req: Party.Request,
  party: WorkspaceParty
) {
  // 1. authorize

  // 2. Validate data
  const body = await req.json();
  const validatedFields = WorkspaceSchema.pick({
    name: true,
    slug: true,
  }).safeParse(body);

  if (!validatedFields.success) {
    return badRequest();
  }

  const { data } = validatedFields;

  const res = await fetch(
    `${party.room.env.AUTH_DOMAIN}/api/update-workspace`,
    {
      method: "POST",
      headers: {
        // Accept: "application/json",
        authorization: party.room.env.SERVICE_KEY as string,
        workspaceId: party.room.id,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) return badRequest();

  await party.poke({ type: "workspaceInfo" });

  party.versions.set("workspaceInfo", party.versions.get("workspaceInfo")! + 1);

  await party.room.storage.put(REPLICACHE_VERSIONS_KEY, party.versions);
  return ok();
}

import type * as Party from "partykit/server";
import UserParty from "../user-party";
import { badRequest, ok } from "../../lib/http-utils";
import {
  REPLICACHE_VERSIONS_KEY,
  UserWorkspacesStore,
  makeWorkspacesStoreKey,
} from "@repo/data";

export async function removeWorkspace(req: Party.Request, party: UserParty) {
  const serviceKey = req.headers.get("authorization");

  if (serviceKey !== party.room.env.SERVICE_KEY) {
    return badRequest();
  }

  const { workspaceId } = <{ workspaceId: string }>await req.json();

  if (!workspaceId) return badRequest();

  party.workspacesStore.delete(workspaceId);

  // Persist data
  await party.room.storage.put({
    [makeWorkspacesStoreKey()]: party.workspacesStore,
  });

  // Poke update data
  party.poke({ type: "deleteWorkspace", id: workspaceId });

  return ok();
}

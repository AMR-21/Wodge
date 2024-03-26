import type * as Party from "partykit/server";
import UserParty from "../user-party";
import { badRequest, ok } from "../../lib/http-utils";
import {
  REPLICACHE_VERSIONS_KEY,
  UserWorkspacesStore,
  makeWorkspacesStoreKey,
} from "@repo/data";
import { produce } from "immer";

export async function addWorkspace(req: Party.Request, party: UserParty) {
  const serviceKey = req.headers.get("authorization");

  if (serviceKey !== party.room.env.SERVICE_KEY) {
    return badRequest();
  }

  const workspaceId = req.headers.get("workspaceId");
  if (!workspaceId) return badRequest();

  party.workspacesStore.add(workspaceId);

  // Persist data
  await party.room.storage.put({
    [makeWorkspacesStoreKey()]: party.workspacesStore,
  });

  // Account for joining cases
  // party.poke({ type: "workspaceInfo" });

  return ok();
}

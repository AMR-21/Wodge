import type * as Party from "partykit/server";
import UserParty from "../user-party";
import { badRequest, ok } from "../../lib/http-utils";
import { REPLICACHE_VERSIONS_KEY, makeWorkspacesStoreKey } from "@repo/data";

export async function addWorkspace(req: Party.Request, party: UserParty) {
  const { workspaceId } = <
    {
      workspaceId: string;
    }
  >await req.json();

  if (!workspaceId) return badRequest();

  // Update store and versions
  const nextVersion = (party.versions.get("globalVersion") as number) + 1;

  party.versions.set("globalVersion", nextVersion);

  party.workspacesStore.data.push({
    workspaceId,
    environment: "cloud",
  });

  party.workspacesStore.lastModifiedVersion = nextVersion;

  // Persist data
  await party.room.storage.put({
    [makeWorkspacesStoreKey()]: party.workspacesStore,
    [REPLICACHE_VERSIONS_KEY]: party.versions,
  });

  // Register presence
  await party.handlePresence(workspaceId);

  party.poke();
  return ok();
}

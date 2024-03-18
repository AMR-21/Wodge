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

  const workspace = <UserWorkspacesStore>await req.json();

  if (!workspace.workspaceId) return badRequest();

  // Update store and versions
  const nextVersion = (party.versions.get("globalVersion") as number) + 1;

  party.versions.set("globalVersion", nextVersion);

  party.workspacesStore = produce(party.workspacesStore, (draft) => {
    draft.data.push(workspace);
    draft.lastModifiedVersion = nextVersion;
  });

  // Persist data
  await party.room.storage.put({
    [makeWorkspacesStoreKey()]: party.workspacesStore,
    [REPLICACHE_VERSIONS_KEY]: party.versions,
  });

  // Poke update data
  party.poke({ type: "user" });

  return ok();
}

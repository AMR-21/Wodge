import { Request, Storage } from "partykit/server";
import UserParty from "../user-party";
import { repPull } from "../../lib/replicache";
import { UserWorkspacesStore } from "@repo/data/schemas";
import { PatchOperation } from "replicache";
import { USER_WORKSPACES_STORE_KEY } from "@repo/data/keys";
import { ServerWorkspaceStore } from "../../types";

export async function userPull(req: Request, party: UserParty) {
  return await repPull(req, party.room.storage, party.versions, patcher);
}

async function patcher(
  fromVersion: number,
  storage: Storage,
  versions: Map<string, number>
) {
  const workspacesStore = await storage.get<ServerWorkspaceStore>(
    USER_WORKSPACES_STORE_KEY
  );

  const patch: PatchOperation[] = [];

  if (workspacesStore)
    if (workspacesStore.lastModifiedVersion > fromVersion) {
      patch.push({
        op: "put",
        key: USER_WORKSPACES_STORE_KEY,
        value: workspacesStore.data,
      });
    }

  return patch;
}

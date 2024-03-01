import { Request } from "partykit/server";
import UserParty from "../user-party";
import { repPull } from "../../lib/replicache";
import { PatchOperation } from "replicache";
import { makeWorkspacesStoreKey } from "@repo/data";

export async function userPull(req: Request, party: UserParty) {
  return await repPull(req, party.room.storage, party.versions, patcher(party));
}

function patcher(party: UserParty) {
  return async function (fromVersion: number) {
    const { workspacesStore } = party;

    const patch: PatchOperation[] = [];

    if (workspacesStore)
      if (workspacesStore.lastModifiedVersion > fromVersion) {
        patch.push({
          op: "put",
          key: makeWorkspacesStoreKey(),
          value: workspacesStore.data,
        });
      }

    return patch;
  };
}

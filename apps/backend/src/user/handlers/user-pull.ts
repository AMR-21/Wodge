import { Request, Storage } from "partykit/server";
import UserParty from "../user-party";
import { repPull } from "../../lib/replicache";
import { UserSpaceStoreType, UserType } from "@repo/data/schemas";
import { PatchOperation } from "replicache";
import { USER_PREFIX } from "@repo/data/prefixes";

export async function userPull(req: Request, party: UserParty) {
  return await repPull(req, party.room.storage, party.versions, patcher);
}

async function patcher(
  fromVersion: number,
  storage: Storage,
  versions: Map<string, number>
) {
  // // Get modified entries
  // const changedEntriesKeys: string[] = [];

  // [...versions.entries()].forEach(([k, v]) => {
  //   if (v > fromVersion) changedEntriesKeys.push(k);
  // });

  const spaces = await storage.get<UserSpaceStoreType>("spaces");

  const patch: PatchOperation[] = [];

  if (spaces)
    if (spaces.lastModifiedVersion > fromVersion) {
      patch.push({
        op: "put",
        key: "spaces",
        value: spaces.spaces,
      });
    }

  // changedEntries.forEach((entry) => {
  //   if (entry.deleted) {
  //     patch.push({ op: "del", key: USER_PREFIX + entry.id });
  //   } else {
  //     patch.push({
  //       op: "put",
  //       key: USER_PREFIX + entry.id,
  //       // @ts-ignore
  //       value: entry,
  //     });
  //   }
  // });

  return patch;
}

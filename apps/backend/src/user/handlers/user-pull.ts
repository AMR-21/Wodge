import { Request, Storage } from "partykit/server";
import UserParty from "../user-party";
import { repPull } from "../../lib/replicache";
import { UserType } from "@repo/data/schemas";
import { PatchOperation } from "replicache";
import { USER_PREFIX } from "@repo/data/prefixes";

export async function userPull(req: Request, party: UserParty) {
  return await repPull(req, party.room.storage, party.versions, patcher);
}

async function patcher(keys: string[], storage: Storage) {
  const changedEntries = await storage.get<UserType>([...keys]);

  const patch: PatchOperation[] = [];

  changedEntries.forEach((entry) => {
    if (entry.deleted) {
      patch.push({ op: "del", key: USER_PREFIX + entry.id });
    } else {
      patch.push({
        op: "put",
        key: USER_PREFIX + entry.id,
        // @ts-ignore
        value: entry,
      });
    }
  });

  return patch;
}

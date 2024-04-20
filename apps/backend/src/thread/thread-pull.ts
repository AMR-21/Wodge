import type * as Party from "partykit/server";
import { PatcherParams, repPull } from "../lib/replicache";
import { PatchOperation } from "replicache";
import ThreadParty from "./thread-party";

export async function threadPull(req: Party.Request, party: ThreadParty) {
  const userId = req.headers.get("x-user-id")!;
  return await repPull({
    req,
    storage: party.room.storage,
    versions: party.versions,
    patcher: patcher(party, userId),
  });
}

function patcher(party: ThreadParty, userId: string) {
  return async function ({ fromVersion }: PatcherParams) {
    const patch: PatchOperation[] = [];

    if (party.threadMessages.lastModifiedVersion > fromVersion) {
      patch.push({
        op: "put",
        key: "messages",
        value: party.threadMessages.data,
      });
    }

    return patch;
  };
}

import type * as Party from "partykit/server";
import { PatcherParams, repPull } from "../lib/replicache";
import { PatchOperation } from "replicache";
import ThreadParty from "./thread-party";
import { Context } from "hono";

export async function threadPull(party: ThreadParty, c: Context) {
  const userId = c.req.header("x-user-id")!;
  return await repPull({
    req: c.req,
    storage: party.room.storage,
    versions: party.versions,
    patcher: patcher(party, userId),
  });
}

function patcher(party: ThreadParty, userId: string) {
  return async function ({ fromVersion }: PatcherParams) {
    const patch: PatchOperation[] = [];

    if (party.threadPosts.lastModifiedVersion > fromVersion) {
      patch.push({
        op: "put",
        key: "posts",
        value: party.threadPosts.data,
      });
    }

    return patch;
  };
}

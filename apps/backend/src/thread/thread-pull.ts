import { FeatureFlags } from "@repo/data/feature-flags";
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
    patcher: patcher(party, userId, (await party.readFlags()).flags),
  });
}

function patcher(party: ThreadParty, userId: string, flags: FeatureFlags) {
  return async function ({ fromVersion }: PatcherParams) {
    const patch: PatchOperation[] = [];

    // Always replace this collection: flags may change without a data version change.
    patch.push({
      op: "put",
      key: "posts",
      value: party.threadPosts.data.filter(
        (item) => flags.polls || item.type !== "poll",
      ),
    });

    return patch;
  };
}

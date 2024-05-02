import type * as Party from "partykit/server";
import { PatcherParams, repPull } from "../lib/replicache";
import { PatchOperation } from "replicache";

import RoomParty from "./room-party";
import { Context } from "hono";

export async function roomPull(party: RoomParty, c: Context) {
  const userId = c.req.header("x-user-id")!;
  return await repPull({
    req: c.req,
    storage: party.room.storage,
    versions: party.versions,
    patcher: patcher(party, userId),
  });
}

function patcher(party: RoomParty, userId: string) {
  return async function ({ fromVersion }: PatcherParams) {
    const patch: PatchOperation[] = [];

    if (party.roomMessages.lastModifiedVersion > fromVersion) {
      patch.push({
        op: "put",
        key: "messages",
        value: party.roomMessages.data,
      });
    }

    return patch;
  };
}

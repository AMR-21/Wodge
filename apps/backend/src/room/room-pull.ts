import { FeatureFlags } from "@repo/data/feature-flags";
import type * as Party from "partykit/server";
import { PatcherParams, repPull } from "../lib/replicache";
import { PatchOperation } from "replicache";

import RoomParty from "./room-party";
import { Context } from "hono";
import { unauthorized } from "../lib/http-utils";

export async function roomPull(party: RoomParty, c: Context) {
  const userId = c.req.header("x-user-id")!;

  const isAdmin = c.req.header("x-admin") === "true";
  const isOwner = c.req.header("x-owner") === "true";
  const isTeamModerator = c.req.header("x-team-moderator") === "true";
  const canView = c.req.header("x-can-view") === "true";
  if (!canView && !isAdmin && !isOwner && !isTeamModerator)
    return unauthorized();
  return await repPull({
    req: c.req,
    storage: party.room.storage,
    versions: party.versions,
    patcher: patcher(party, userId, (await party.readFlags()).flags),
  });
}

function patcher(party: RoomParty, userId: string, flags: FeatureFlags) {
  return async function ({ fromVersion }: PatcherParams) {
    const patch: PatchOperation[] = [];

    // Always replace this collection: flags may change without a data version change.
    patch.push({
      op: "put",
      key: "messages",
      value: party.messages.data.filter(
        (item) =>
          (flags.polls || item.type !== "poll") &&
          (flags.attachments ||
            !["image", "audio", "video", "file"].includes(item.type)),
      ),
    });

    return patch;
  };
}

import { PatcherParams, repPull } from "../lib/replicache";
import { PatchOperation } from "replicache";
import { Context } from "hono";
import PageParty from "./page-party";
import { unauthorized } from "../lib/http-utils";

export async function pagePull(party: PageParty, c: Context) {
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
    patcher: patcher(party, userId),
  });
}

function patcher(party: PageParty, userId: string) {
  return async function ({ fromVersion }: PatcherParams) {
    const patch: PatchOperation[] = [];

    if (party.db.lastModifiedVersion > fromVersion) {
      patch.push({
        op: "put",
        key: "columns",
        value: party.db.data.columns,
      });
      patch.push({
        op: "put",
        key: "tasks",
        value: party.db.data.tasks,
      });
    }

    return patch;
  };
}

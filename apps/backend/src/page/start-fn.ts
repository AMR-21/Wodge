import { REPLICACHE_VERSIONS_KEY } from "@repo/data";
import { Versions } from "../types";
import PageParty from "./page-party";

export async function startFn(party: PageParty) {
  party.boards = (await party.room.storage.get("boards")) || {
    data: [],
    lastModifiedVersion: 0,
    deleted: false,
  };

  party.versions = <Versions>(
    ((await party.room.storage.get(REPLICACHE_VERSIONS_KEY)) ||
      new Map<string, number | boolean>([["globalVersion", 0]]))
  );
}

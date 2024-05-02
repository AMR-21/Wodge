import { REPLICACHE_VERSIONS_KEY } from "@repo/data";
import { Versions } from "../types";
import ThreadParty from "./thread-party";

export async function startFn(party: ThreadParty) {
  party.threadMessages = (await party.room.storage.get("messages")) || {
    data: [],
    lastModifiedVersion: 0,
    deleted: false,
  };

  party.versions = <Versions>(
    ((await party.room.storage.get(REPLICACHE_VERSIONS_KEY)) ||
      new Map<string, number | boolean>([["globalVersion", 0]]))
  );
}

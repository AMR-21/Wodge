import { getRequestContext } from "@cloudflare/next-on-pages";
import { closedFlags } from "@repo/data/feature-flags";
import { gateHttpRequest } from "@repo/data/feature-policy";
import { databaseFlagReader } from "@repo/data/feature-store";

const readers = new WeakMap<object, ReturnType<typeof databaseFlagReader>>();

export async function readFeatureFlags() {
  try {
    const database = getRequestContext().env.DB;
    let read = readers.get(database);
    if (!read) {
      read = databaseFlagReader(database);
      readers.set(database, read);
    }
    return await read();
  } catch {
    return {
      flags: closedFlags(),
      validUntil: Date.now(),
      source: "closed" as const,
    };
  }
}

export async function gateHttpFeature(request: Request) {
  return gateHttpRequest(request, readFeatureFlags);
}

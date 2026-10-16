import type { D1Database } from "@cloudflare/workers-types";
import { createDb, type DataDb } from "./lib/create-db";
import { createUserModel } from "./models/auth/auth";
import { createWorkspaceModel } from "./models/workspace/workspace-model";

export { createDb } from "./lib/create-db";
export type { DataDb } from "./lib/create-db";

// Construct per request. Never retain a request-bound D1 object globally.
// These are persistence operations; callers must enforce actor authorization.
export function createDataServer(binding: D1Database) {
  return createDataModels(() => createDb(binding));
}

// Lazy DB creation preserves each operation's existing failure handling.
export function createDataModels(getDb: () => DataDb) {
  return {
    ...createUserModel(getDb),
    ...createWorkspaceModel(getDb),
  };
}

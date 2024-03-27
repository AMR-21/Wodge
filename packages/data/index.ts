/**
 * Client modules
 */

import { DeepReadonlyObject } from "replicache";

/**
 * End of client modules
 */

/**
 * Shared schemas
 */

export * from "./schemas/auth.schema";
export * from "./schemas/user.schema";
export * from "./schemas/workspace.schema";
export * from "./schemas/team.schema";
export * from "./schemas/channel.schema";
export * from "./schemas/config";

/**
 * End of shared schemas
 */

/**
 * Keys
 */

export * from "./lib/keys";

/**
 * End of keys
 */

/**
 * RBAC
 */

export * from "./lib/rbac";

/**
 * End of RBAC
 */

/**
 * Utils
 */

export * from "./lib/utils";

export type DrObj<T> = DeepReadonlyObject<T>;

/**
 * Mutators
 */

export * from "./models/workspace/workspace-shared-model";

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
export * from "./schemas/thread.schema";
export * from "./schemas/room.schema";
export * from "./schemas/page.schema";
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
export * from "./models/room/room-mutators";
export * from "./models/thread/thread-mutators";
export * from "./models/page/page-mutators";
export * from "./models/room/create-room-rep";
export * from "./models/thread/create-thread-rep";
export * from "./models/page/create-page-rep";

/**
 * Default symbol to join multiple keys
 */
export const JOINER = "/";

/** User */
export const USER_PREFIX = "user/";
export const USER_WORKSPACES_STORE_KEY = "workspaces";

/** Workspace */
export const WORKSPACE_PREFIX = "workspace/";
export const WORKSPACE_STRUCTURE_KEY = "structure";
export const WORKSPACE_ROLES_KEY = "roles";
export const WORKSPACE_MEMBERS_KEY = "members";

export const makeWorkspaceKey = (id: string) => WORKSPACE_PREFIX + id;

/** Replicache */
export const REPLICACHE_CLIENT_GROUP_PREFIX = "clientGroup/";
export const REPLICACHE_CLIENT_PREFIX = "client/";

export const makeClientKey = (clientId: string, clientGroupId: string) =>
  clientGroupId + JOINER + REPLICACHE_CLIENT_PREFIX + clientId;

export const makeClientGroupKey = (clientGroupId: string) =>
  REPLICACHE_CLIENT_GROUP_PREFIX + clientGroupId;

export const extractClientId = (clientKey: string) => clientKey.split("/")[3];

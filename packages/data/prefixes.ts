/**
 * Default symbol to join multiple keys
 */
export const JOINER = "/";

/** User */
export const USER_PREFIX = "user/";
export const USER_WORKSPACES_STORE_PREFIX = "workspaces";

/** Workspace */
export const WORKSPACE_PREFIX = "workspace/";
export const WORKSPACE_ROLES_PREFIX = "roles";
export const WORKSPACE_MEMBERS_PREFIX = "members";

export const makeWorkspaceKey = (id: string) => WORKSPACE_PREFIX + id;
export const makeRolesKey = (workspaceId: string) =>
  WORKSPACE_PREFIX + workspaceId + JOINER + WORKSPACE_ROLES_PREFIX;
export const makeMembersKey = (workspaceId: string) =>
  WORKSPACE_PREFIX + workspaceId + JOINER + WORKSPACE_MEMBERS_PREFIX;

/** Replicache */
export const REPLICACHE_CLIENT_GROUP_PREFIX = "clientGroup/";
export const REPLICACHE_CLIENT_PREFIX = "client/";

export const makeClientKey = (clientId: string, clientGroupId: string) =>
  clientGroupId + JOINER + REPLICACHE_CLIENT_PREFIX + clientId;

export const makeClientGroupKey = (clientGroupId: string) =>
  REPLICACHE_CLIENT_GROUP_PREFIX + clientGroupId;

export const extractClientId = (clientKey: string) => clientKey.split("/")[3];

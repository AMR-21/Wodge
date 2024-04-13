/**
 * Credits to partykit nextjs chat template
 */
import type * as Party from "partykit/server";
import { badRequest, error, ok, unauthorized } from "./http-utils";
import WorkspaceParty from "../workspace/workspace-party";
import { AuthChannelResponse } from "../workspace/handlers/auth-channel";
import { ChannelsTypes } from "@repo/data";

/**
 * Referenced from user client model
 */
export type Session = {
  sessionToken: string;
  userId: string;
  expires: string;
  user: {
    id: string;
    username: string;
  };
};

/**
 * Check if a session is valid by checking if it exists and if it has expired
 */
export const isSessionValid = (
  session?: Session | null
): session is Session => {
  return Boolean(
    session && (!session.expires || session.expires > new Date().toISOString())
  );
};

/**
 * Get the current session by the cookie in the request and from the
 * next-auth endpoint
 */
export const getSession = async (req: Party.Request, lobby: Party.Lobby) => {
  // Extract auth cookies from the request
  // Should be on the same domain in order to work
  const cookie = req.headers.get("cookie");

  if (!cookie) throw new Error("No cookie found");

  // Fetch the session from the auth endpoint validated by the CSRF token
  const res = await fetch(`${lobby.env.AUTH_DOMAIN}/api/auth/session`, {
    headers: {
      Accept: "application/json",
      Cookie: cookie,
    },
  });

  if (!res.ok) throw new Error("Unauthorized");

  const session = (await res.json()) as Session;

  // Validate the session
  if (!session || !isSessionValid(session)) throw new Error("Invalid Session");

  // Set user id in a header for some use cases
  req.headers.set("x-user-id", session.userId);
  // req.headers.set("x-user-data", JSON.stringify(session.user));

  return session;
};

/**
 *  Check if the user is authorized to access the workspace
 */

export const authWorkspaceAccess = async (
  req: Party.Request,
  lobby: Party.Lobby
) => {
  // TODO: replace this by the binding within partykit when supported
  // 1. read user session and membership from db in 1 batch
  const cookie = req.headers.get("cookie");

  const workspaceId = lobby.id;
  if (!cookie) return false;

  const res = await fetch(`${lobby.env.AUTH_DOMAIN}/api/workspace-access`, {
    headers: {
      Accept: "application/json",
      authorization: lobby.env.SERVICE_KEY as string,
      cookie,
      workspaceId,
    },
  });

  // console.log(workspaceId);
  // 2. check if user is authentic
  // 3. check if user is member of workspace
  if (!res.ok) return false;

  return true;
};

/**
 * Edge network version
 */
export const checkMembershipEdge = async (
  userId: string,
  lobby: Party.Lobby
) => {
  // 1. Get the party instance
  const workspaceParty = lobby.parties.workspace;

  if (!workspaceParty) return false;

  // 2. Get the workspace instance
  const workspace = workspaceParty.get(lobby.id);

  if (!workspace) return false;

  // 3. Get the current user membership
  const res = await workspace.fetch("/membership", {
    headers: {
      authorization: lobby.env.SERVICE_KEY as string,
      "x-user-id": userId,
    },
  });

  const data = await res.json();

  return !!data?.success;
};

/**
 * Normal version
 */
export const checkMembership = (userId: string, party: WorkspaceParty) => {
  return (
    party.workspaceMembers.data.createdBy === userId ||
    party.workspaceMembers.data.members.some((m) => m.id === userId)
  );
};

export const authorizeChannel = async (
  req: Party.Request,
  lobby: Party.Lobby,
  userId: string,
  type: ChannelsTypes
) => {
  const workspaceId = req.headers.get("x-workspace-id");
  const teamId = req.headers.get("x-team-id");
  const folderId = req.headers.get("x-folder-id");

  if (!workspaceId || !teamId) return badRequest();

  const workspaceParty = lobby.parties.workspace?.get(workspaceId);

  if (!workspaceParty) return badRequest();

  if (!userId) return unauthorized();

  if (!teamId) return unauthorized();

  if (type === "page" && !folderId) return badRequest();

  const res = await workspaceParty.fetch("/auth-channel", {
    headers: {
      //@ts-ignore
      "x-workspace-id": workspaceId,
      "x-team-id": teamId,
      "x-user-id": userId,
      "x-channel-id": lobby.id,
      "x-channel-type": type,
      authorization: lobby.env.SERVICE_KEY as string,
      ...(type === "page" && { "x-folder-id": folderId }),
    },
  });

  if (res.status !== 200) return unauthorized();

  const body = (await res.json()) as AuthChannelResponse;

  if (!body.success) return unauthorized();

  req.headers.set("channel-auth", JSON.stringify(body));

  return req;
};

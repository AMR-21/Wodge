/**
 * Credits to partykit nextjs chat template
 */
import type * as Party from "partykit/server";
import { error, ok, unauthorized } from "./http-utils";
import WorkspaceParty from "../workspace/workspace-party";

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
  req.headers.set("x-user-data", JSON.stringify(session.user));

  return session;
};

/**
 *  Check if the user is authorized to access the workspace
 */

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
    party.workspaceMembers.data.owner === userId ||
    party.workspaceMembers.data.members.some((m) => m.id === userId)
  );
};

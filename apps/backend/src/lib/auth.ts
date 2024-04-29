/**
 * Credits to partykit nextjs chat template
 */
import type * as Party from "partykit/server";
import { badRequest, error, ok, unauthorized } from "./http-utils";
import WorkspaceParty from "../workspace/workspace-party";
import { AuthChannelResponse } from "../workspace/handlers/auth-channel";
import { ChannelsTypes, UserType } from "@repo/data";
import { createClient } from "@supabase/supabase-js";
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

// curl -X GET 'https://uqkkqllielmukapbadjn.supabase.co/auth/v1/user' \
// -H "apikey: SUPABASE_KEY" \
// -H "Authorization: Bearer USER_TOKEN"

export const getCurrentUser = async (
  req: Party.Request,
  lobby: Party.Lobby
) => {
  // Extract auth cookies from the request
  // Should be on the same domain in order to work
  const cookie = req.headers.get("cookie");

  if (!cookie) throw new Error("No cookie found");

  const parseCookie = (str: string) =>
    str
      .split(";")
      .map((v) => v.split("="))
      .reduce((acc, v) => {
        //@ts-ignore
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      }, {});

  const supabase = createClient(
    lobby.env.NEXT_PUBLIC_SUPABASE_URL as string,
    lobby.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      auth: { persistSession: false },
    }
  );

  // console.log(
  //   await supabase.auth.getUser(
  //     "eyJhbGciOiJIUzI1NiIsImtpZCI6IklyZTNVbGlFckFxMVU5SGciLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzE0NDIxMTE3LCJpYXQiOjE3MTQ0MTc1MTcsImlzcyI6Imh0dHBzOi8vdXFra3FsbGllbG11a2FwYmFkam4uc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImJmYzM4YTBlLTkzMDAtNDlmZC04ZTI4LWY1NzA4MTNjMzcxOSIsImVtYWlsIjoiYW1yeWFzc2VyNTIwMDFAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJnaXRodWIiLCJwcm92aWRlcnMiOlsiZ2l0aHViIl19LCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvNjk3NjIxMzI_dj00IiwiZW1haWwiOiJhbXJ5YXNzZXI1MjAwMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiQU1SIFlBU1NFUiIsImlzcyI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20iLCJuYW1lIjoiQU1SIFlBU1NFUiIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoiQU1SLTIxIiwicHJvdmlkZXJfaWQiOiI2OTc2MjEzMiIsInN1YiI6IjY5NzYyMTMyIiwidXNlcl9uYW1lIjoiQU1SLTIxIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE3MTQ0MTc1MTd9XSwic2Vzc2lvbl9pZCI6ImIzOWNiMDc0LWY3ZGEtNGI1OC1hZmNhLTJjYzZmMmRhYjBlMiIsImlzX2Fub255bW91cyI6ZmFsc2V9.PIRmP7EzFHYbMJquNdW1POLituFb6U81dgMY42oUQ6M"
  //   )
  // );
  // console.log(parseCookie(cookie));
  // console.log(
  //   await fetch(`${lobby.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
  //     headers: {
  //       apikey: lobby.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  //       // Authorization: `Bearer ${cookie}`,
  //       cookie: cookie,
  //     },
  //   })
  // );

  // Fetch the session from the auth endpoint validated by the CSRF token
  const res = await fetch(`${lobby.env.AUTH_DOMAIN}/auth/user`, {
    headers: {
      Accept: "application/json",
      Cookie: cookie,
    },
  });

  if (!res.ok) throw new Error("Unauthorized");

  const user = (await res.json()) as UserType;

  // Validate the session
  if (!user) throw new Error("Invalid Session");

  // Set user id in a header for some use cases
  req.headers.set("x-user-id", user.id);

  req.headers.set("x-user-data", JSON.stringify(user));

  return user;
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

  //@ts-ignore
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
  type: ChannelsTypes,
  obj?: { folderId: string; teamId: string; workspaceId: string }
) => {
  const workspaceId = obj?.workspaceId ?? req.headers.get("x-workspace-id");
  const teamId = obj?.teamId ?? req.headers.get("x-team-id");
  const folderId = obj?.folderId ?? req.headers.get("x-folder-id");

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

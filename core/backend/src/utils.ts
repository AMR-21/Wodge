/**
 * Credits to partykit nextjs chat template
 */
import type * as Party from "partykit/server";

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
 * General CORS configuration
 * Must be changed in production
 */
export const CORS = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
  "Access-Control-Allow-Headers": "Authorization",
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
 * Helper function that sends a json response including generic data
 */
export const json = <T>(data: T, status = 200) =>
  Response.json(data, { status, headers: CORS });

/**
 * Helper function that sends a json response with a 200 status and ok message
 */
export const ok = () => json({ ok: true });

/**
 * Helper function that sends a json response with a 500 status and error message
 */
export const error = (err: string | { message: string }, status = 500) => {
  console.error("Error response", err);
  return json(
    {
      ok: false,
      error: typeof err === "string" ? err : err.message ?? "Unknown error",
    },
    status
  );
};

/**
 * Helper function that sends a 404 status response
 */
export const notFound = () => error("Not found", 404);

/**
 * Helper function that sends a 204 status response
 */
export const noContent = () =>
  new Response(null, { status: 204, headers: CORS });

/**
 * Helper function that sends a 304 status response
 */
export const notChanged = () =>
  new Response(null, { status: 304, headers: CORS });

/**
 * Helper function that sends a 401 status response
 */
export const unauthorized = () => error("Unauthorized", 401);

/**
 * Helper function that sends a 400 status response
 */
export const badRequest = () => error("Bad request", 400);

/**
 * Helper function to get the route of the request from the url
 */
export const getRoute = (req: Party.Request) => {
  const pathname = new URL(req.url).pathname;
  const routes = pathname.split("/");
  return routes.length > 3 ? "/" + routes.slice(4).join("/") : "/";
};

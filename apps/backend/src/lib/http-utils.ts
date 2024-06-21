/**
 * Credits to partykit nextjs chat template
 */
import type * as Party from "partykit/server";

/**
 * HTTP Helpers
 */

/**
 * General CORS configuration
 * Must be changed in production
 */
export const CORS = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PATCH",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers":
    "Authorization, Content-Type, X-Replicache-RequestID, x-team-id, x-workspace-id, x-folder-id, x-file-path, x-is-message-file, x-user-id, domain, id, is-upload",
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
 * Helper function that sends a 501 status response
 */
export const notImplemented = () => error("Not implemented", 501);

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

/**
 * End of HTTP Helpers
 */

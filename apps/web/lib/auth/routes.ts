/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 */
export const publicRoutes: string[] = ["/"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 */
export const authRoutes: string[] = ["/auth/login", "/auth/error"];

/**
 * The prefix for API authentication routes
 * Routes that start with prefix are used for API authentication purposes
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/protected";

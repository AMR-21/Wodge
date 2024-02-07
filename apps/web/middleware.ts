import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/lib/auth/routes";
import { auth } from "@/lib/auth/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const hasProfile = !!req.auth?.user?.hasProfile;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isOnboardingRoute = nextUrl.pathname === "/onboarding";

  // order matters here
  // api auth routes for auth.js
  if (isApiAuthRoute) {
    return null;
  }

  // auth routes ex. login, onboarding
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return null;
  }

  // User is not authentic and trying to access a protected route
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  // User is authentic but has no profile
  if (!hasProfile && !isOnboardingRoute) {
    return Response.redirect(new URL("/onboarding", nextUrl));
  }

  // User is authentic, has profile, and trying to access onboarding route
  if (isOnboardingRoute && hasProfile) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

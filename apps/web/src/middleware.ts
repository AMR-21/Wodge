import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";
import { createDb, getUserById } from "@repo/data/server";
import { users } from "@repo/data";
import { authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./routes";

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  let curUser = await getUserById(user.data.user?.id);

  // handle saving user data on our side
  if (user.data.user && !curUser) {
    const db = createDb();

    const { id, email, user_metadata } = user.data.user;

    curUser = await db
      .insert(users)
      .values({
        id: id,
        email: email!,
        displayName: user_metadata?.full_name || "",
        avatar: user_metadata?.avatar_url || "",
      })
      .returning()
      .get();
  }

  const { nextUrl } = request;

  const isLoggedIn = !!curUser;
  const hasUsername = !!curUser?.username;

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isOnboardingRoute = nextUrl.pathname === "/onboarding";

  // order matters here
  // api auth routes for auth.js
  // if (isApiAuthRoute) {
  //   return;
  // }

  // auth routes ex. login, onboarding
  if (isAuthRoute) {
    if (nextUrl.pathname === "/auth/user") {
      return response;
    }

    if (nextUrl.pathname === "/api/update-user") {
      return response;
    }

    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return response;
  }

  // User is not authentic and trying to access a protected route
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  // User is authentic but has no profile
  if (!hasUsername && !isOnboardingRoute) {
    return Response.redirect(new URL("/onboarding", nextUrl));
  }

  // // User is authentic, has profile, and trying to access onboarding route
  if (isOnboardingRoute && hasUsername) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  return response;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// import {
//   DEFAULT_LOGIN_REDIRECT,
//   apiAuthPrefix,
//   authRoutes,
//   publicRoutes,
// } from "./routes";
// import { auth } from "@/lib/auth";

// export default auth((req) => {
//   const { nextUrl } = req;
//   const isLoggedIn = !!req.auth;
//   // const hasUsername = !!req.auth?.user?.hasUsername;
//   const hasUsername = !!req.auth?.user?.username;

//   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
//   const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
//   const isAuthRoute = authRoutes.includes(nextUrl.pathname);
//   const isOnboardingRoute = nextUrl.pathname === "/onboarding";

//   // order matters here
//   // api auth routes for auth.js
//   if (isApiAuthRoute) {
//     return;
//   }

//   // auth routes ex. login, onboarding
//   if (isAuthRoute) {
//     if (isLoggedIn) {
//       return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//     }

//     return;
//   }

//   // User is not authentic and trying to access a protected route
//   if (!isLoggedIn && !isPublicRoute) {
//     return Response.redirect(new URL("/login", nextUrl));
//   }

//   // User is authentic but has no profile
//   if (!hasUsername && !isOnboardingRoute) {
//     return Response.redirect(new URL("/onboarding", nextUrl));
//   }

//   // // User is authentic, has profile, and trying to access onboarding route
//   if (isOnboardingRoute && hasUsername) {
//     return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//   }

//   return;
// });

// // Optionally, don't invoke Middleware on some paths
// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

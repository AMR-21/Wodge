// import NextAuth from "next-auth";
// import Github from "next-auth/providers/github";
// import Google from "next-auth/providers/google";
// import type { Adapter } from "@auth/core/adapters";
// import { nanoid } from "nanoid";
// import { eq } from "drizzle-orm";

// import { DbAdapter } from "./adapter";
// import { env as secretEnv } from "@repo/env";
// import { users } from "@repo/data";
// import { sendMagicLink } from "./utils";
// import { createDb } from "@repo/data/server";

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   pages: {
//     signIn: "/login",
//     error: "/login/error",
//     newUser: "/onboarding",
//     signOut: "/logout",
//   },

//   events: {
//     async linkAccount({ user, account }) {
//       if (account.provider === "github" || account.provider === "google") {
//         const db = createDb();
//         user?.id &&
//           (await db
//             .update(users)
//             .set({ emailVerified: new Date() })
//             .where(eq(users.id, user.id)));
//       }
//     },
//   },

//   callbacks: {
//     async session({ user, session }) {
//       return {
//         ...session,
//         user: {
//           id: user.id,
//           username: user?.username,
//           email: user?.email,
//           avatar: user?.avatar,
//           displayName: user?.displayName,
//         },
//       };
//     },
//   },

//   // @ts-ignore
//   adapter: DbAdapter(() => createDb()) as Adapter,

//   session: {
//     strategy: "database",
//     generateSessionToken() {
//       return nanoid(36);
//     },
//   },

//   providers: [
//     Github({
//       clientId: secretEnv.GITHUB_CLIENT_ID,
//       clientSecret: secretEnv.GITHUB_CLIENT_SECRET,
//       allowDangerousEmailAccountLinking: true,
//     }),

//     Google({
//       clientId: secretEnv.GOOGLE_CLIENT_ID,
//       clientSecret: secretEnv.GOOGLE_CLIENT_SECRET,
//       allowDangerousEmailAccountLinking: true,

//       profile(profile) {
//         return {
//           ...profile,
//           id: profile.sub,
//           image: profile.picture,
//         };
//       },
//     }),
//     {
//       id: "email",
//       type: "email",
//       from: "auth@example.com",
//       server: {},
//       maxAge: 300,
//       name: "Email",
//       options: {},
//       async sendVerificationRequest({ identifier, url }) {
//         sendMagicLink({ identifier, url });
//       },
//       async generateVerificationToken() {
//         return nanoid();
//       },
//     },
//   ],
// });

// // cookies: {
// //   sessionToken: {
// //     name: `__Secure-next-auth.session-token`,
// //     options: {
// //       httpOnly: true,
// //       sameSite: 'lax',
// //       path: '/',
// //       secure: true
// //     }
// //   },
// //   callbackUrl: {
// //     name: `__Secure-next-auth.callback-url`,
// //     options: {
// //       sameSite: 'lax',
// //       path: '/',
// //       secure: true
// //     }
// //   },
// //   csrfToken: {
// //     name: `__Host-next-auth.csrf-token`,
// //     options: {
// //       httpOnly: true,
// //       sameSite: 'lax',
// //       path: '/',
// //       secure: true
// //     }
// //   },
// //   pkceCodeVerifier: {
// //     name: `${cookiePrefix}next-auth.pkce.code_verifier`,
// //     options: {
// //       httpOnly: true,
// //       sameSite: 'lax',
// //       path: '/',
// //       secure: true,
// //       maxAge: 900
// //     }
// //   },
// //   state: {
// //     name: `${cookiePrefix}next-auth.state`,
// //     options: {
// //       httpOnly: true,
// //       sameSite: "lax",
// //       path: "/",
// //       secure: true,
// //       maxAge: 900
// //     },
// //   },
// //   nonce: {
// //     name: `${cookiePrefix}next-auth.nonce`,
// //     options: {
// //       httpOnly: true,
// //       sameSite: "lax",
// //       path: "/",
// //       secure: true,
// //     },
// //   },
// // }

import NextAuth, { DefaultSession, Session, User } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

import { env } from "@/lib/env";
import { db } from "@/lib/db";
import { sendMagicLink } from "../utils";
import { SQLiteDrizzleAdapter } from "./drizzle-adapter";
import { users } from "@repo/data";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  // adapter: DrizzleAdapter(db),
  adapter: SQLiteDrizzleAdapter(db),
  session: {
    generateSessionToken() {
      return nanoid();
    },

    strategy: "database",
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    // signOut
    // verifyRequest
    newUser: "/auth/complete-profile",
  },

  events: {
    async linkAccount({ user, account }) {
      if (account.provider === "github" || account.provider === "google") {
        user?.id &&
          (await db
            .update(users)
            .set({ emailVerified: new Date() })
            .where(eq(users.id, user.id)));
      }
    },
  },

  callbacks: {
    async session({ user, session }) {
      if (session.user && user) {
        session.user.id = user.id;
        session.user.hasProfile = user.hasProfile;
      }
      return session;
    },
  },

  providers: [
    {
      id: "email",
      type: "email",
      from: "auth@example.com",
      server: {},
      maxAge: 24 * 60 * 60,
      name: "Email",
      options: {},
      async sendVerificationRequest({ identifier, url }) {
        sendMagicLink({ identifier, url });
      },
      async generateVerificationToken() {
        return nanoid();
      },
    },

    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),

    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        console.log({ profile });
        return {
          // ...profile,
          id: profile.sub,
          email: profile.email,
          // emailVerified: profile.email_verified ?  : null,
          image: profile.picture,
          name: profile.name,
        };
      },
    }),
  ],
});

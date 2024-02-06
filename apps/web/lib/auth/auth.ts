import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { Adapter } from "@auth/core/adapters";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { SQLiteDrizzleAdapter } from "./adapter";
import { db } from "@/lib/db";
import { env } from "../env";
import { users } from "@/data/schemas/auth.schema";
import { sendMagicLink } from "../server-utils";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/login/error",
    newUser: "/onboarding",
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
      if (session.user) {
        session.user.hasProfile = user.hasProfile;
        session.user.id = user.id;
      }

      return session;
    },
  },

  // Bug: Typeerror - typical Next-Auth bugs
  // @ts-ignore
  adapter: SQLiteDrizzleAdapter(db) as Adapter,

  session: { strategy: "database" },

  providers: [
    Github({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
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
  ],
});

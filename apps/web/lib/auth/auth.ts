import NextAuth, { Session } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { env } from "@/lib/env";
import { db } from "@/lib/db";
import { sendMagicLink } from "../utils";
import { SQLiteDrizzleAdapter } from "./drizzle-adapter";
import { users } from "@repo/data";
import { AdapterUser } from "@auth/core/adapters";
import { User } from "@auth/core/types";
import { ExtendedUser } from "@/next-auth";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  // adapter: DrizzleAdapter(db),
  adapter: SQLiteDrizzleAdapter(db),
  // session: {
  //   // generateSessionToken() {
  //   //   return nanoid();
  //   // },

  //   strategy: "database",
  // },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    // signOut
    // verifyRequest
    // newUser: "/auth/complete-profile",
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
    }),
  ],
});

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { env } from "@/lib/env";
import { db } from "@/lib/db";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    {
      id: "email",
      type: "email",
      from: "auth@example.com",
      server: {},
      maxAge: 24 * 60 * 60,
      name: "Email",
      options: {},
      async sendVerificationRequest({
        identifier: email,
        url,
      }: {
        identifier: string;
        url: string;
      }) {
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              to: [email],
              from: env.RESEND_EMAIL_FROM,
              subject: "Verify your email",
              html: `<a href="${url}">Verify your email ${url}</a>`,
            }),
          });
        } catch (error) {
          console.error("Error sending email:", error);
          // throw new Error("Error sending email");
        }
      },
    },

    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),

    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});

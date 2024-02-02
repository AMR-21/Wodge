import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
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
      id: "resend",
      type: "email",
      async sendVerificationRequest({
        identifier: email,
        url,
      }: {
        identifier: string;
        url: string;
      }) {
        const response = await fetch("https://api.resend.com/emails", {
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

        const { headers } = response;
        const contentType = headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          console.log(JSON.stringify(await response.json()));
        } else console.log(response.text());
      },
    },

    Discord({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),

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

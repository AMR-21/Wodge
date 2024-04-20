import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    AUTH_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    RESEND_API_KEY: z.string(),
    RESEND_EMAIL_FROM: z.string(),
    SERVICE_KEY: z.string(),
  },

  client: {
    NEXT_PUBLIC_BACKEND_DOMAIN: z.string(),
    NEXT_PUBLIC_REPLICACHE_KEY: z.string(),
    NEXT_PUBLIC_FS_DOMAIN: z.string(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_BACKEND_DOMAIN: process.env.NEXT_PUBLIC_BACKEND_DOMAIN,
    NEXT_PUBLIC_REPLICACHE_KEY: process.env.NEXT_PUBLIC_REPLICACHE_KEY,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_EMAIL_FROM: process.env.RESEND_EMAIL_FROM,
    NEXT_PUBLIC_FS_DOMAIN: process.env.NEXT_PUBLIC_FS_DOMAIN,
    FS_DOMAIN: process.env.FS_DOMAIN,
    USER_AVATAR_BUCKET: process.env.USER_AVATAR_BUCKET,
    SERVICE_KEY: process.env.SERVICE_KEY,
  },
});

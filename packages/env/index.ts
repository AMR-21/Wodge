import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    RESEND_API_KEY: z.string(),
    RESEND_EMAIL_FROM: z.string(),
    SECRET_KEY: z.string(),
    LIVEKIT_API_KEY: z.string(),
    LIVEKIT_API_SECRET: z.string(),
    APP_DOMAIN: z.string(),
    BACKEND_DOMAIN: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WH_SECRET: z.string(),
    STRIPE_LOOKUP_KEY: z.string(),
  },

  client: {
    NEXT_PUBLIC_BACKEND_DOMAIN: z.string(),
    NEXT_PUBLIC_REPLICACHE_KEY: z.string(),
    NEXT_PUBLIC_LIVEKIT_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_AVATARS_URL: z.string(),
    NEXT_PUBLIC_APP_DOMAIN: z.string(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    APP_DOMAIN: process.env.APP_DOMAIN,
    BACKEND_DOMAIN: process.env.BACKEND_DOMAIN,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_AVATARS_URL: process.env.NEXT_PUBLIC_AVATARS_URL,
    LIVEKIT_API_KEY: process.env.LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET: process.env.LIVEKIT_API_SECRET,
    NEXT_PUBLIC_LIVEKIT_URL: process.env.NEXT_PUBLIC_LIVEKIT_URL,
    NEXT_PUBLIC_BACKEND_DOMAIN: process.env.NEXT_PUBLIC_BACKEND_DOMAIN,
    NEXT_PUBLIC_REPLICACHE_KEY: process.env.NEXT_PUBLIC_REPLICACHE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_EMAIL_FROM: process.env.RESEND_EMAIL_FROM,
    SECRET_KEY: process.env.SECRET_KEY,
    NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WH_SECRET: process.env.STRIPE_WH_SECRET,
    STRIPE_LOOKUP_KEY: process.env.STRIPE_LOOKUP_KEY,
  },
});

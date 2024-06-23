type Env = Readonly<{
  NODE_ENV: "development" | "test" | "production";
  APP_DOMAIN: string;
  BACKEND_DOMAIN: string;
  RESEND_API_KEY: string;
  RESEND_EMAIL_FROM: string;
  NEXT_PUBLIC_BACKEND_DOMAIN: string;
  NEXT_PUBLIC_REPLICACHE_KEY: string;
  SERVICE_KEY: string;
  NEXT_PUBLIC_FS_DOMAIN: string;
  LIVEKIT_API_KEY: string;
  LIVEKIT_API_SECRET: string;
  NEXT_PUBLIC_LIVEKIT_URL: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_AVATARS_URL: string;
  NEXT_PUBLIC_APP_DOMAIN: string;
  PAYMOB_API_KEY: string;
  PAYMOB_HMAC: string;
  PAYMOB_PK_KEY: string;
  PAYMOB_SK_KEY: string;
  PAYMOB_INTEGRATION_ID: string;
  PAYMOB_IFRAME_URL: string;
}>;

declare module "@repo/env" {
  export const env: Env;
}

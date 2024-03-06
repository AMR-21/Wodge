export type env = Readonly<{
  NODE_ENV: "development" | "test" | "production";
  AUTH_SECRET: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  RESEND_API_KEY: string;
  RESEND_EMAIL_FROM: string;
  NEXT_PUBLIC_BACKEND_DOMAIN: string;
  NEXT_PUBLIC_REPLICACHE_KEY: string;
}>;

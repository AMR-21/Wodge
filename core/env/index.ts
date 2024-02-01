import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    AUTH_SECRET: z.string(),
    // DB: z.,
    DB_HOST: z.enum(["local", "cloud"]),
    DB_NAME: z.string(),
  },
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
  },
});

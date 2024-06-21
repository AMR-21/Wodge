import { env } from "@repo/env";
import * as jose from "jose";

export async function sign(data?: any, duration: string = "1m") {
  const jwt = await new jose.SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(duration)
    .sign(new TextEncoder().encode(env.SERVICE_KEY));

  return jwt;
}

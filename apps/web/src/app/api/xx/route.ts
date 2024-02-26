import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET(req: Request) {
  const { env, cf, ctx } = getRequestContext();

  console.log({ env, cf, ctx });
  return new Response("Hello, world!");
}

import { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { env } = getRequestContext();

  const input = { prompt: "What is the origin of the phrase Hello, World" };

  // console.log({ env });
  console.log(env.AI);

  // console.log(await env.DB.exec("SELECT * FROM users"));
  const answer = await env.AI.run("@cf/meta/llama-2-7b-chat-int8", input);

  return new Response("Hello, World");
}

// Next.js Edge API Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/router-handlers#edge-and-nodejs-runtimes

import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  let responseText = "Hello World";
  const d1 = process.env.DB;

  // console.log(
  //   process.env.WODGE_DB.exec(
  //     "create table if not exists test (id integer primary key, name text)"
  //   )
  // );
  console.log(d1);

  // In the edge runtime you can use Bindings that are available in your application
  // (for more details see:
  //    - https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-bindings-in-your-nextjs-application
  //    - https://developers.cloudflare.com/pages/functions/bindings/
  // )
  //
  // KV Example:
  // const myKv = process.env.MY_KV;
  // console.log(myKv);
  // // await myKv.put("suffix", " from a KV store!");
  // const suffix = await myKv.get("suffix");

  // console.log(suffix);
  // responseText += suffix;

  return new Response(responseText);
}

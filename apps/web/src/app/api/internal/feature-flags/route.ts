import { readFeatureFlags } from "@/lib/feature-flags";
import { env } from "@repo/env";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (
    !env.SECRET_KEY ||
    request.headers.get("authorization") !== `Bearer ${env.SECRET_KEY}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }
  return Response.json(await readFeatureFlags(), {
    headers: { "Cache-Control": "no-store" },
  });
}

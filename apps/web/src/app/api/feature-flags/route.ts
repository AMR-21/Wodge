import { readFeatureFlags } from "@/lib/feature-flags";

export const dynamic = "force-dynamic";

// Public, non-sensitive environment configuration; available even during auth failures.
export async function GET() {
  return Response.json(await readFeatureFlags(), {
    headers: { "Cache-Control": "no-store" },
  });
}

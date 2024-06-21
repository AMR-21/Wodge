import { createClient } from "@/lib/supabase/server";
import { getWorkspacesByUserId } from "@repo/data/server";

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");

  if (!userId) return new Response(null, { status: 401 });

  const res = await getWorkspacesByUserId(userId);

  const workspaces = res.map((r) => r.workspaces);

  return Response.json(workspaces, { status: 200 });
}

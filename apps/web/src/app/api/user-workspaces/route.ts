import { createClient } from "@/lib/supabase/server";
import { getWorkspacesByUserId } from "@repo/data/server";

export async function GET(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) return new Response(null, { status: 401 });

  const res = await getWorkspacesByUserId(user.id);

  const workspaces = res.map((r) => r.workspaces);

  return Response.json(workspaces, { status: 200 });
}

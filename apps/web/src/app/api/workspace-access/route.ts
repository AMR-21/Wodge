import { createClient } from "@/lib/supabase/server";
import { memberships } from "@repo/data";
import { createDb } from "@repo/data/server";
import { env } from "@repo/env";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  const db = createDb();
  const supabase = createClient();
  const serviceKey = req.headers.get("authorization");

  if (env.SERVICE_KEY !== serviceKey)
    return new Response(null, { status: 401 });

  const user = await supabase.auth.getUser();

  if (!user || !user.data.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const workspaceId = req.headers.get("workspace-id");

  if (!workspaceId) return new Response("Unauthorized", { status: 401 });

  const membership = await db.query.memberships.findFirst({
    where: and(
      eq(memberships.userId, user.data.user.id),
      eq(memberships.workspaceId, workspaceId),
    ),
  });

  if (!membership) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response("Authorized", { status: 200 });
}

import { auth } from "@/lib/auth";
import { memberships } from "@repo/data";
import { createDb } from "@repo/data/server";
import { env } from "@repo/env";
import { and, eq } from "drizzle-orm";

export const runtime = "edge";

export async function POST(req: Request) {
  const db = createDb();
  const serviceKey = req.headers.get("authorization");

  if (env.SERVICE_KEY !== serviceKey)
    return new Response(null, { status: 401 });

  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const workspaceId = req.headers.get("workspace-id");

  if (!workspaceId) return new Response("Unauthorized", { status: 401 });

  const membership = await db.query.memberships.findFirst({
    where: and(
      eq(memberships.userId, session.user.id),
      eq(memberships.workspaceId, workspaceId),
    ),
  });

  if (!membership) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response("Authorized", { status: 200 });
}

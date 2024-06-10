import { invites } from "@repo/data";
import { createDb } from "@repo/data/server";
import { env } from "@repo/env";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const db = createDb();

  const serviceKey = req.headers.get("authorization");

  if (env.SERVICE_KEY !== serviceKey)
    return new Response(null, { status: 401 });

  const workspaceId = req.headers.get("workspaceId");

  if (!workspaceId) {
    return new Response(null, { status: 401 });
  }

  try {
    const invitesData = await db
      .select()
      .from(invites)
      .where(eq(invites.workspaceId, workspaceId));

    return Response.json({ invites: invitesData }, { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(null, { status: 400 });
  }
}

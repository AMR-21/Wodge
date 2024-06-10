import { workspaces } from "@repo/data";
import { createDb } from "@repo/data/server";
import { env } from "@repo/env";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const db = createDb();

  const serviceKey = req.headers.get("authorization");

  if (env.SERVICE_KEY !== serviceKey)
    return new Response(null, { status: 401 });

  const workspaceId = req.headers.get("workspaceId");

  if (!workspaceId) {
    return new Response(null, { status: 401 });
  }

  try {
    await db.run(
      sql`UPDATE ${workspaces} SET is_invite_link_enabled = 1 - is_invite_link_enabled WHERE id = ${workspaceId}`,
    );

    return new Response(null, { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(null, { status: 400 });
  }
}

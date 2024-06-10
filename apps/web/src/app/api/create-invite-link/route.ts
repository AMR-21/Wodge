import { invites, workspaces } from "@repo/data";
import { createDb } from "@repo/data/server";
import { env } from "@repo/env";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const db = createDb();

  const serviceKey = req.headers.get("authorization");

  if (env.SERVICE_KEY !== serviceKey)
    return new Response(null, { status: 401 });

  const workspaceId = req.headers.get("workspaceId");

  const userId = req.headers.get("userId");

  if (!workspaceId || !userId) {
    return new Response(null, { status: 401 });
  }

  try {
    const token = nanoid(8);

    const invite = await db
      .update(invites)
      .set({ token, createdBy: userId })
      .where(eq(invites.workspaceId, workspaceId))
      .returning()
      .get();

    return Response.json(invite, { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(null, { status: 400 });
  }
}

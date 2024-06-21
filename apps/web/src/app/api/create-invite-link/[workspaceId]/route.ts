import { invites, workspaces } from "@repo/data";
import { createDb } from "@repo/data/server";
import { env } from "@repo/env";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { sign } from "../../../../lib/utils/sign";

export async function POST(
  req: NextRequest,
  {
    params: { workspaceId },
  }: { params: { workspaceId: string; token: string } },
) {
  const db = createDb();

  const userId = req.headers.get("x-user-id");

  if (!userId) return new Response(null, { status: 401 });

  const authToken = await sign({ userId });

  const res = await fetch(
    `${env.BACKEND_DOMAIN}/parties/workspace/${workspaceId}/service/isAdmin?token=${authToken}`,
    { headers: { authorization: env.SERVICE_KEY as string } },
  );

  if (!res.ok) return new Response(null, { status: 401 });

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

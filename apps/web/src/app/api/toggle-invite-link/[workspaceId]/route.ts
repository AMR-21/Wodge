import { workspaces } from "@repo/data";
import { createDb } from "@repo/data/server";
import { env } from "@repo/env";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { sign } from "../../../../lib/utils/sign";

export async function PATCH(
  req: NextRequest,
  { params: { workspaceId } }: { params: { workspaceId: string } },
) {
  const db = createDb();

  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return new Response(null, { status: 401 });
  }

  const token = await sign({ userId });

  const authRes = await fetch(
    `${env.BACKEND_DOMAIN}/parties/workspace/${workspaceId}/service/isAdmin?token=${token}`,
    { headers: { authorization: env.SERVICE_KEY as string } },
  );

  if (!authRes.ok) return new Response(null, { status: 401 });

  try {
    await db.run(
      sql`UPDATE ${workspaces} SET is_invite_link_enabled = 1 - is_invite_link_enabled WHERE id = ${workspaceId}`,
    );

    return new Response(null, { status: 200 });
  } catch (e) {
    return new Response(null, { status: 400 });
  }
}

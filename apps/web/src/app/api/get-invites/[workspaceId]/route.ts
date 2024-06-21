import { sign } from "@/lib/utils/sign";
import { invites } from "@repo/data";
import { createDb } from "@repo/data/server";
import { env } from "@repo/env";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { workspaceId } }: { params: { workspaceId: string } },
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

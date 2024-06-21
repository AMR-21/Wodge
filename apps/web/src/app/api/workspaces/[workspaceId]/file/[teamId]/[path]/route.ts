import { sign } from "@/lib/utils/sign";
import { env } from "@repo/env";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params: { teamId, workspaceId, path },
  }: { params: { workspaceId: string; teamId: string; path?: string } },
) {
  const userId = req.headers.get("x-user-id");

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const token = await sign({ userId });

  return redirect(
    `${env.BACKEND_DOMAIN}/parties/workspace/${workspaceId}/file/${teamId}/${path}?token=${token}`,
  );
}

export async function DELETE(
  req: NextRequest,
  {
    params: { teamId, workspaceId, path },
  }: { params: { workspaceId: string; teamId: string; path?: string } },
) {
  const userId = req.headers.get("x-user-id");

  if (!userId) return new Response("Unauthorized", { status: 401 });

  const token = await sign({ userId });

  return redirect(
    `${env.BACKEND_DOMAIN}/parties/workspace/${workspaceId}/files/${teamId}/${path}?token=${token}`,
  );
}

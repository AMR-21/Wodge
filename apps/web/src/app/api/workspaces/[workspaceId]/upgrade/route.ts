import { NextRequest } from "next/server";
import { isWorkspaceAdmin } from "../../is-workspace-admin";
import { getWorkspaceById, upgradeWorkspace } from "@repo/data/server";
import { env } from "@repo/env";
import { sign } from "@/lib/utils/sign";

export async function POST(
  req: NextRequest,
  { params: { workspaceId } }: { params: { workspaceId: string } },
) {
  const userId = req.headers.get("x-user-id");

  if (!userId) return new Response("Unauthorized", { status: 401 });

  if (!(await isWorkspaceAdmin(userId, workspaceId)))
    return new Response("Unauthorized", { status: 401 });

  const workspace = await getWorkspaceById(workspaceId);

  if (!workspace) return new Response("Not found", { status: 404 });

  if (workspace.isPremium)
    return new Response("Already premium", { status: 400 });

  //TODO: Should do the payment here

  const upgrade = await upgradeWorkspace(workspaceId);

  if (!upgrade) return new Response("Failed to upgrade", { status: 500 });

  const token = await sign({ userId });
  // inform users about the upgrade
  await fetch(
    `${env.BACKEND_DOMAIN}/parties/workspace/${workspaceId}/service/poke?token=${token}`,
    { method: "POST", headers: { authorization: env.SERVICE_KEY } },
  );

  return new Response("OK", { status: 200 });
}

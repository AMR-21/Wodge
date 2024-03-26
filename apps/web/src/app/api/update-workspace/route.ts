import { Workspace } from "@repo/data";
import { updateWorkspaceById } from "@repo/data/server";
import { env } from "@repo/env";

export async function POST(req: Request) {
  const serviceKey = req.headers.get("authorization");

  if (env.SERVICE_KEY !== serviceKey)
    return new Response(null, { status: 401 });

  const workspaceId = req.headers.get("workspaceId")!;

  const workspace = (await req.json()) as Pick<Workspace, "name" | "slug">;

  await updateWorkspaceById(workspaceId, workspace);

  return new Response(null, { status: 200 });
}

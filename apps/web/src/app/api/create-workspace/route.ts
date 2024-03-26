import { Workspace } from "@repo/data";
import { createWorkspace } from "@repo/data/server";
import { env } from "@repo/env";

export async function POST(req: Request) {
  const serviceKey = req.headers.get("authorization");

  if (env.SERVICE_KEY !== serviceKey)
    return new Response(null, { status: 401 });

  const workspace = (await req.json()) as Workspace;

  const res = await createWorkspace({ ...workspace, createdAt: new Date() });

  if (res.error) return new Response(res.error, { status: 400 });

  return Response.json(res.workspace, { status: 201 });
}

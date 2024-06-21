import { sign } from "@/lib/utils/sign";
import { Workspace, WorkspaceSchema } from "@repo/data";
import { updateWorkspaceById } from "@repo/data/server";
import { env } from "@repo/env";

export async function POST(
  req: Request,
  { params: { workspaceId } }: { params: { workspaceId: string } },
) {
  const userId = req.headers.get("x-user-id");

  const token = await sign({ userId });

  const authRes = await fetch(
    `${env.BACKEND_DOMAIN}/parties/workspace/${workspaceId}/service/isAdmin?token=${token}`,
    { headers: { authorization: env.SERVICE_KEY as string } },
  );

  if (!authRes.ok) return new Response(null, { status: 401 });

  const body = await req.json();

  const validatedFields = WorkspaceSchema.pick({
    name: true,
    slug: true,
  }).safeParse(body);

  if (!validatedFields.success) {
    return new Response(null, { status: 400 });
  }

  const { data: workspace } = validatedFields;

  await updateWorkspaceById(workspaceId, workspace);

  const res = await fetch(
    `${env.BACKEND_DOMAIN}/parties/workspace/${workspaceId}/update?token=${token}`,
    { method: "POST" },
  );

  if (!res.ok) return new Response(null, { status: 500 });

  return new Response(null, { status: 200 });
}

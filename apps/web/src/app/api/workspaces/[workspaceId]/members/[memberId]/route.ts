import { removeMember } from "@repo/data/server";
import { isWorkspaceAdmin } from "../../../is-workspace-admin";

export async function DELETE(
  req: Request,
  {
    params: { workspaceId, memberId },
  }: { params: { workspaceId: string; memberId: string } },
) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return new Response(null, { status: 400 });
  }

  if (!(await isWorkspaceAdmin(userId, workspaceId)))
    return new Response(null, { status: 401 });

  if (!memberId || !workspaceId) return new Response(null, { status: 400 });

  await removeMember(memberId, workspaceId);

  return new Response(null, { status: 200 });
}

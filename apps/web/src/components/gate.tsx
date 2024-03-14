import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useCurrentWorkspace } from "./workspace/workspace-context";
import { Role, grant } from "@repo/data";

export function Gate({
  children,
  permissions,
}: {
  children: React.ReactNode;
  permissions: Role["permissions"];
}) {
  const { members, structure } = useCurrentWorkspace();
  const user = useCurrentUser();

  const currentMember = { roles: [] };

  // console.log(members, structure);
  if (!members) return null;

  if (!currentMember) {
    return null;
  }

  const roles = currentMember.roles.map((roleId) =>
    structure?.roles.find((r) => r.id === roleId),
  ) as Role[];

  const isOwner = members.owner === user?.id;

  const hasPermission = grant(roles, permissions);

  if (isOwner || hasPermission) return <>{children}</>;

  return null;
}

import { isAdmin, isOwner } from "@repo/data";
import { useCurrentUser } from "./use-current-user";
import { useCurrentWorkspace } from "./use-current-workspace";

export function useIsOwnerOrAdmin() {
  const { members } = useCurrentWorkspace();

  const { user } = useCurrentUser();

  return (
    isAdmin({ members, userId: user?.id }) ||
    isOwner({ members, userId: user?.id })
  );
}

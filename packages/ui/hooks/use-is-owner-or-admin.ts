import { isAdmin, isOwner } from "@repo/data";
import { useCurrentUser } from "./use-current-user";
import { useCurrentWorkspace } from "./use-current-workspace";
import { useEffect, useState } from "react";

export function useIsOwnerOrAdmin() {
  const { members } = useCurrentWorkspace();

  const { user } = useCurrentUser();

  const [grant, setGrant] = useState(false);
  useEffect(() => {
    setGrant(
      isAdmin({ members, userId: user?.id }) ||
        isOwner({ members, userId: user?.id }),
    );
  }, [members, user?.id]);
  return grant;
}

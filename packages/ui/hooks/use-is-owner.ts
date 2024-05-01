import { useEffect, useState } from "react";
import { useCurrentUser } from "./use-current-user";
import { useCurrentWorkspace } from "./use-current-workspace";
import { isOwner } from "@repo/data";

export function useIsOwner() {
  const { members } = useCurrentWorkspace();

  const { user } = useCurrentUser();

  const [grant, setGrant] = useState(false);
  useEffect(() => {
    setGrant(isOwner({ members, userId: user?.id }));
  }, [members, user?.id]);
  return grant;
}

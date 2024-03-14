"use client";

import { useEffect } from "react";
import { useWorkspaceId } from "./ui/use-workspace-id";
import { useAppState, useUser, useUserWorkspaces } from "..";

export function useCurrentWorkspace() {
  const workspaceId = useWorkspaceId();
  const user = useUser();
  const workspaceStore = useAppState((s) => s.workspaces);
  const { userWorkspaces } = useUserWorkspaces();
  const curWorkspace = userWorkspaces?.find(
    (w) => w.workspaceId === workspaceId,
  );
  const { addWorkspace } = useAppState((s) => s.actions);

  useEffect(() => {
    if (curWorkspace && user && workspaceId && !workspaceStore?.[workspaceId]) {
      addWorkspace(workspaceId, curWorkspace.environment, user.id);
    }
  }, [userWorkspaces, workspaceId, user, workspaceStore]);

  return workspaceStore?.[workspaceId];
}

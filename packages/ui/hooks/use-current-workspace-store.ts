"use client";

import { useEffect } from "react";
import { useCurrentUser } from "./use-current-user";
import { useAppState } from "../store/store";
import { useUserWorkspaces } from "./use-user-workspaces";
import { useCurrentWorkspaceId } from "./use-current-workspace-id";

export function useCurrentWorkspaceStore() {
  const workspaceId = useCurrentWorkspaceId();
  const user = useCurrentUser();
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

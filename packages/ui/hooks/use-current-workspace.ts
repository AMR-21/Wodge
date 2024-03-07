import { useMemo } from "react";
import { useWorkspaceId } from "./ui/use-workspace-id";
import { WorkspacesRegistry } from "@repo/data";

export function useCurrentWorkspace() {
  // return workspace;
  const workspaceId = useWorkspaceId();

  const workspace = useMemo(() => {
    const reg = WorkspacesRegistry.getInstance();

    return reg.getWorkspace(workspaceId);
  }, [workspaceId]);
  return workspace;
}

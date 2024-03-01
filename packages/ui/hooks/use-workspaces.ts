"use client";

import { WorkspacesRegistry } from "@repo/data";
import { makeWorkspaceKey } from "@repo/data";
import { ReadTransaction } from "replicache";
import { useMemo, useState } from "react";
import { WorkspaceType } from "@repo/data";
import { useUserWorkspaces } from "./use-user-workspaces";

/**
 * A hook to return workspaces' meta data
 */
export function useWorkspaces() {
  const [isPending, setIsPending] = useState(true);
  const [workspaces, setWorkspaces] = useState<Record<string, WorkspaceType>>();

  const userWorkspaces = useUserWorkspaces();

  const workspacesRegistry = WorkspacesRegistry.getInstance();

  useMemo(() => {
    setIsPending(true);
    if (userWorkspaces) {
      // 1. Loop over each workspace store
      userWorkspaces?.map(({ workspaceId }) => {
        const workspace = workspacesRegistry.getWorkspace(workspaceId);

        // 2. Add subscription to each workspace in order to be reactive
        workspace?.store.subscribe(
          (tx: ReadTransaction) =>
            tx.get<WorkspaceType>(makeWorkspaceKey(workspaceId)),
          {
            // 3. On data change update the state
            onData: function (data?: WorkspaceType) {
              if (data)
                setWorkspaces((prev) => ({ ...prev, [workspaceId]: data }));
            },
          },
        );
      });
    }
    setIsPending(false);
  }, [userWorkspaces]);

  return { workspaces, isPending };
}

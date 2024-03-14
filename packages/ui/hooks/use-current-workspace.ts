import { useEffect, useState } from "react";
import { useActions } from "../store/store-hooks";
import { useCurrentUser } from "./use-current-user";
import { useCurrentWorkspaceId } from "./use-current-workspace-id";
import { ReadTransaction, Replicache } from "replicache";
import { useUserWorkspaces } from "./use-user-workspaces";
import { useSubscribe } from "./use-subscribe";
import {
  Workspace,
  WorkspaceMembers,
  WorkspaceStructure,
  makeWorkspaceKey,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
} from "@repo/data";
import { workspaceMutators } from "@repo/data/models/workspace/workspace-mutators";

export function useCurrentWorkspace() {
  const [workspaceRep, setWorkspaceRep] = useState<Replicache<
    typeof workspaceMutators
  > | null>(null);

  const workspaceId = useCurrentWorkspaceId();
  const user = useCurrentUser();
  const { getWorkspace } = useActions();
  const userWorkspace = useUserWorkspaces().userWorkspaces?.find(
    (w) => w.workspaceId === workspaceId,
  );

  useEffect(() => {
    if (!user || !workspaceId || !userWorkspace) return;

    const workspaceStore = getWorkspace(
      workspaceId,
      userWorkspace.environment,
      user.id,
    );

    if (!workspaceStore) return;

    setWorkspaceRep(workspaceStore);
  }, [user, workspaceId, userWorkspace]);

  const { snapshot: structure, isPending: isStructurePending } = useSubscribe(
    workspaceRep,
    (tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey()),
    {
      dependencies: [workspaceRep],
    },
  );

  const { snapshot: members, isPending: isMembersPending } = useSubscribe(
    workspaceRep,
    (tx: ReadTransaction) =>
      tx.get<WorkspaceMembers>(makeWorkspaceMembersKey()),
    {
      dependencies: [workspaceRep],
    },
  );

  const { snapshot: workspace, isPending: isWorkspacePending } = useSubscribe(
    workspaceRep,
    (tx: ReadTransaction) => tx.get<Workspace>(makeWorkspaceKey()),
    {
      dependencies: [workspaceRep],
    },
  );

  return {
    workspaceRep,
    workspace,
    isWorkspacePending,
    structure,
    isStructurePending,
    members,
    isMembersPending,
  };
}

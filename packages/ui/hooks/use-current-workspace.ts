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
  defaultWorkspaceMembers,
  defaultWorkspaceStructure,
  makeWorkspaceKey,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
} from "@repo/data";
import { workspaceMutators } from "@repo/data/models/workspace/workspace-mutators";
import { useRouter } from "next/navigation";

export function useCurrentWorkspace() {
  const [workspaceRep, setWorkspaceRep] = useState<Replicache<
    typeof workspaceMutators
  > | null>(null);

  const workspaceId = useCurrentWorkspaceId();
  const { user, isUserPending } = useCurrentUser();
  const { getWorkspace } = useActions();
  const { userWorkspaces, isUserWorkspacesPending } = useUserWorkspaces();
  const router = useRouter();

  const userWorkspace = userWorkspaces?.find(
    (w) => w.workspaceId === workspaceId,
  );

  const isPending = isUserPending || isUserWorkspacesPending;

  useEffect(() => {
    if (isPending) return;
    if (!user || !workspaceId || !userWorkspace)
      // return router.replace("/workspaces");
      return;

    const workspaceStore = getWorkspace(
      workspaceId,
      userWorkspace.environment,
      user.id,
    );

    if (!workspaceStore) return;

    setWorkspaceRep(workspaceStore);
  }, [user, workspaceId, userWorkspace, isPending]);

  const { snapshot: structure, isPending: isStructurePending } = useSubscribe(
    workspaceRep,
    (tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey()),
    {
      dependencies: [workspaceRep],
      default: defaultWorkspaceStructure(),
    },
  );

  const { snapshot: members, isPending: isMembersPending } = useSubscribe(
    workspaceRep,
    (tx: ReadTransaction) =>
      tx.get<WorkspaceMembers>(makeWorkspaceMembersKey()),
    {
      dependencies: [workspaceRep],
      default: defaultWorkspaceMembers(),
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
    workspaceId,
  };
}

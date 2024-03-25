import { useEffect, useMemo, useState } from "react";
import { useActions } from "../store/store-hooks";
import { useCurrentUser } from "./use-current-user";
import { ReadTransaction, Replicache } from "replicache";
import { useUserWorkspaces } from "./use-user-workspaces";
import { useSubscribe } from "./use-subscribe";
import {
  WorkspaceMembers,
  WorkspaceStructure,
  defaultWorkspaceMembers,
  defaultWorkspaceStructure,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
} from "@repo/data";
import { workspaceMutators } from "@repo/data/models/workspace/workspace-mutators";
import { useParams, useRouter } from "next/navigation";

export function useCurrentWorkspace() {
  const [workspaceRep, setWorkspaceRep] = useState<Replicache<
    typeof workspaceMutators
  > | null>(null);
  const router = useRouter();

  const { workspaceSlug } = useParams() as { workspaceSlug: string };
  const { user, isUserPending } = useCurrentUser();
  const { getWorkspace } = useActions();
  const { userWorkspaces, isUserWorkspacesPending } = useUserWorkspaces();

  const workspace = useMemo(
    () => userWorkspaces?.find((w) => w.slug === workspaceSlug),
    [userWorkspaces],
  );

  const workspaceId = workspace?.id;

  const isPending = isUserPending || isUserWorkspacesPending;

  useEffect(() => {
    if (isPending) return;
    if (!user || !workspaceSlug || !workspace || !workspaceId)
      // return router.replace("/workspaces");
      return;

    const workspaceStore = getWorkspace(workspaceId, user.id);

    if (!workspaceStore) return;

    setWorkspaceRep(workspaceStore);
  }, [user, workspaceSlug, workspace, isPending]);

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

  return {
    workspaceRep,
    structure,
    workspace,
    isStructurePending,
    members,
    isMembersPending,
    workspaceId,
    workspaceSlug,
  };
}

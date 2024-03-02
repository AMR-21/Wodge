"use client";

import { Member, PublicUserType, WorkspacesRegistry } from "@repo/data";
import { useParams } from "next/navigation";
import { useUserWorkspaces } from "./use-user-workspaces";
import { ReadTransaction } from "replicache";
import {
  makeWorkspaceKey,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
} from "@repo/data";
// import { useSubscribe } from "./use-subscribe";

import { useSubscribe } from "replicache-react";
import {
  WorkspaceMembers,
  WorkspaceStructure,
  WorkspaceType,
} from "@repo/data";
import { useMemo } from "react";

export function useCurrentWsData() {
  const { workspaceId } = useParams();

  const registry = WorkspacesRegistry.getInstance();
  const workspace = registry.getWorkspace(workspaceId as string);

  const metadata = useSubscribe(workspace?.store, async (tx: ReadTransaction) =>
    tx.get<WorkspaceType>(makeWorkspaceKey(workspaceId as string)),
  ) as WorkspaceType | undefined;

  const members = useSubscribe(workspace?.store, async (tx: ReadTransaction) =>
    tx.get<WorkspaceMembers>(makeWorkspaceMembersKey()),
  );

  const inviters = useMemo(() => {
    if (!members) return [];

    const hash: Record<string, Pick<Member, "id" | "data">> = {};

    const result = members.members.map((member) => {
      if (!member.joinInfo.token) return;

      const createdBy = member.joinInfo.created_by;

      if (hash[createdBy]) return;

      const inviter = members.members.find((m) => m.id === createdBy);

      if (!inviter) return;

      const inviterData = { id: inviter.id, data: inviter.data };
      hash[createdBy] = inviterData;

      return inviterData;
    });

    return result.filter((r) => !!r);
  }, [members]);

  const structure = useSubscribe(
    workspace?.store,
    async (tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey()),
  );

  return { metadata, members, structure, inviters };
}

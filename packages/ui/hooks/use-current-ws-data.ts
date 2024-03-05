"use client";

import { Member, WorkspacesRegistry } from "@repo/data";
import { useParams } from "next/navigation";
import { ReadTransaction } from "replicache";
import {
  makeWorkspaceKey,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
} from "@repo/data";

import { useSubscribe } from "./use-subscribe";
import {
  WorkspaceMembers,
  WorkspaceStructure,
  WorkspaceType,
} from "@repo/data";
import { useMemo } from "react";

export function useCurrentWsData() {
  const { workspaceId }: { workspaceId: string } = useParams();

  const registry = WorkspacesRegistry.getInstance();
  const workspace = registry.getWorkspace(workspaceId as string);

  const { snapshot: metadata, isPending } = useSubscribe(
    workspace?.store,
    async (tx: ReadTransaction) =>
      tx.get<WorkspaceType>(makeWorkspaceKey(workspaceId as string)),
  );

  const { snapshot: members } = useSubscribe(
    workspace?.store,
    async (tx: ReadTransaction) =>
      tx.get<WorkspaceMembers>(makeWorkspaceMembersKey()),
  );

  const { snapshot: structure } = useSubscribe(
    workspace?.store,
    async (tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey()),
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

  if (!workspaceId) return null;

  // Workspace does not exist
  if (!metadata && !isPending) return null;

  return { metadata, members, structure, inviters, workspaceId };
}

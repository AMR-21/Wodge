"use client";

import { Member, WorkspacesRegistry } from "@repo/data";
import { useParams } from "next/navigation";
import { ReadTransaction } from "replicache";
import {
  makeWorkspaceKey,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
} from "@repo/data";

import { useSubscribe } from "../use-subscribe";
import {
  WorkspaceMembers,
  WorkspaceStructure,
  WorkspaceType,
} from "@repo/data";
import { useMemo } from "react";
import { useWorkspaceId } from "../ui/use-workspace-id";

export function useCurrentWsData() {
  const workspaceId = useWorkspaceId();

  const registry = WorkspacesRegistry.getInstance();
  const workspace = registry.getWorkspace(workspaceId);

  const { snapshot: metadata, isPending } = useSubscribe(
    workspace?.store,
    async (tx: ReadTransaction) => tx.get<WorkspaceType>(makeWorkspaceKey()),
  );

  const { snapshot: members } = useSubscribe(
    workspace?.store,
    async (tx: ReadTransaction) =>
      tx.get<WorkspaceMembers>(makeWorkspaceMembersKey()),
    {
      default: {
        members: [],
        owner: "",
      },
    } satisfies { default: WorkspaceMembers },
  );

  const { snapshot: structure } = useSubscribe(
    workspace?.store,
    async (tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey()),
    {
      default: {
        publicChannels: [],
        roles: [],
        teams: [],
        tags: [],
      },
    } satisfies { default: WorkspaceStructure },
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

  // Workspace does not exist

  return { metadata, members, structure, inviters, workspaceId, workspace };
}

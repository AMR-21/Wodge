"use client";

import { WorkspacesRegistry } from "@repo/data/client-models";
import { useParams } from "next/navigation";
import { useUserWorkspaces } from "./use-user-workspaces";
import { ReadTransaction } from "replicache";
import {
  makeWorkspaceKey,
  makeWorkspaceMembersKey,
  makeWorkspaceStructureKey,
} from "@repo/data/keys";
// import { useSubscribe } from "./use-subscribe";

import { useSubscribe } from "replicache-react";
import {
  WorkspaceMembers,
  WorkspaceStructure,
  WorkspaceType,
} from "@repo/data/schemas";
import { useEffect, useState } from "react";

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

  const structure = useSubscribe(
    workspace?.store,
    async (tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey()),
  );

  return { metadata, members, structure };
}

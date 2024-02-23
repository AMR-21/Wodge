"use client";

import { WorkspacesStore } from "@repo/data/client-models";
import { useLocalUser } from "./use-local-user";
import { useSubscribe } from "replicache-react";
import { WORKSPACES_STORE_PREFIX } from "@repo/data/prefixes";

export function useWorkspaces() {
  const store = useLocalUser()?.store;
  const spaces = useSubscribe(
    store,
    async (tx) => tx.get(WORKSPACES_STORE_PREFIX),
    {},
  ) as WorkspacesStore;

  return spaces;
}

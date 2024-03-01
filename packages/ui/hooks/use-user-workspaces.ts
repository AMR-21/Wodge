"use client";

import { useLocalUser } from "./use-local-user";
import { ReadTransaction } from "replicache";
import { makeWorkspacesStoreKey } from "@repo/data";
import { UserWorkspacesStore } from "@repo/data";
import { useSubscribe } from "replicache-react";

export function useUserWorkspaces() {
  const user = useLocalUser();

  const workspaces = useSubscribe(user?.store, (tx: ReadTransaction) =>
    tx.get<UserWorkspacesStore>(makeWorkspacesStoreKey()),
  );

  return workspaces;
}

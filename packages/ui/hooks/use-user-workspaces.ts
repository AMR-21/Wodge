"use client";

import { useCurrentUser } from "./use-current-user";
import { ReadTransaction } from "replicache";
import { makeWorkspacesStoreKey } from "@repo/data";
import { UserWorkspacesStore } from "@repo/data";
import { useSubscribe } from "replicache-react";

export function useUserWorkspaces() {
  const user = useCurrentUser();

  const workspaces = useSubscribe(user?.store, (tx: ReadTransaction) =>
    tx.get<UserWorkspacesStore>(makeWorkspacesStoreKey()),
  );

  return workspaces;
}

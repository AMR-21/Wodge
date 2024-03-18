"use client";

import { ReadTransaction } from "replicache";
import { useSubscribe } from "./use-subscribe";
import { useCurrentUser } from "./use-current-user";
import { useUserStore } from "../store/store-hooks";
import { UserWorkspacesStore, makeWorkspacesStoreKey } from "@repo/data";

export function useUserWorkspaces() {
  // Make sure user store is created
  useCurrentUser();

  const userStore = useUserStore();

  const { snapshot: userWorkspaces, isPending } = useSubscribe(
    userStore,
    (tx: ReadTransaction) =>
      tx.get<UserWorkspacesStore[]>(makeWorkspacesStoreKey()),
    {
      dependencies: [userStore],
    },
  );

  return { userWorkspaces, isUserWorkspacesPending: isPending };
}
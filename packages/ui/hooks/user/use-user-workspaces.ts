"use client";

import { ReadTransaction } from "replicache";
import { makeWorkspacesStoreKey, users } from "@repo/data";
import { UserWorkspacesStore } from "@repo/data";
import { useSubscribe } from "../use-subscribe";
import { useUserStore } from "../../store/store";
import { useUser } from "../use-user";

export function useUserWorkspaces() {
  // Make sure user store is created
  useUser();

  const userStore = useUserStore();

  const { snapshot: userWorkspaces, isPending } = useSubscribe(
    userStore,
    (tx: ReadTransaction) =>
      tx.get<UserWorkspacesStore[]>(makeWorkspacesStoreKey()),
    {
      dependencies: [userStore],
    },
  );

  return { userWorkspaces, isPending };
}

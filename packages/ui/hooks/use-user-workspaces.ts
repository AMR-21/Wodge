"use client";

import { ReadTransaction } from "replicache";
import { useSubscribe } from "./use-subscribe";
import { useCurrentUser } from "./use-current-user";
import { useUserStore } from "../store/store-hooks";
import {
  UserWorkspacesStore,
  Workspace,
  makeWorkspacesStoreKey,
} from "@repo/data";
import { useQuery } from "@tanstack/react-query";
import { env } from "@repo/env";

export function useUserWorkspaces() {
  // Make sure user store is created
  const { user } = useCurrentUser();

  const { data, isPending } = useQuery({
    queryKey: ["user-workspaces"],
    queryFn: async () => {
      // if (!user?.id) return;
      const res = await fetch(`/api/user-workspaces`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch workspaces data");

      const data = (await res.json()) as Workspace[];
      return data;
    },
    enabled: !!user?.id,
  });

  return { userWorkspaces: data, isUserWorkspacesPending: isPending };
}

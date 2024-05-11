"use client";

import { useCurrentUser } from "./use-current-user";
import { Workspace } from "@repo/data";
import { useQuery } from "@tanstack/react-query";

export function useUserWorkspaces() {
  const { user } = useCurrentUser();

  const { data, isPending } = useQuery({
    queryKey: ["user-workspaces"],
    queryFn: async () => {
      const res = await fetch(`/api/user-workspaces`);

      if (!res.ok) throw new Error("Failed to fetch workspaces data");

      const data = (await res.json()) as Workspace[];

      return data;
    },

    enabled: !!user?.id,
  });

  return { userWorkspaces: data, isUserWorkspacesPending: isPending };
}

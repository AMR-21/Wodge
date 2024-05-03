"use client";

import { useCurrentUser } from "./use-current-user";
import { Workspace } from "@repo/data";
import { useQuery } from "@tanstack/react-query";
import { atom, useSetAtom } from "jotai";
import { updateAtom } from "..";


export function useUserWorkspaces() {
  // Make sure user store is created
  const { user } = useCurrentUser();
  const setUpdateAtom = useSetAtom(updateAtom);

  const { data, isPending } = useQuery({
    queryKey: ["user-workspaces"],
    queryFn: async () => {
      const res = await fetch(`/api/user-workspaces`);

      if (!res.ok) throw new Error("Failed to fetch workspaces data");

      const data = (await res.json()) as Workspace[];

      setUpdateAtom((v) => !v);
      return data;
    },

    enabled: !!user?.id,
  });

  return { userWorkspaces: data, isUserWorkspacesPending: isPending };
}

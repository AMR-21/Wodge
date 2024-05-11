"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { PublicUserType, users } from "@repo/data";
import { usePathname } from "next/navigation";

import { createUserRep } from "@/store/create-user-rep";
import { useAppState } from "@/store/store";

type Session = {
  sessionToken: string;
  userId: string;
  expires: string;
  user: PublicUserType;
};

export function useCurrentUser() {
  const { connectSocket } = useAppState.getState().actions;

  const pathname = usePathname();
  const { data, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch("/auth/user");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = (await response.json()) as typeof users.$inferSelect;
      return data;
    },
    enabled: !pathname.startsWith("/login"),
  });

  // if (!isPending && !data) throw Error("Error loading user");

  useEffect(() => {
    if (!isPending && data) {
      if (!useAppState.getState().userStore) createUserRep(data?.id);
      if (!useAppState.getState().socket) connectSocket(data?.id);
    }
  }, [data, isPending]);

  return { user: data, isUserPending: isPending };
}

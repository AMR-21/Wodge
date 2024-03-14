"use client";

import { Session, replicacheWrapper } from "@repo/data";
import { useQuery } from "@tanstack/react-query";
import { useAppState } from "..";
import {
  PullRequest,
  PullerResult,
  PushRequest,
  PusherResult,
  Replicache,
} from "replicache";
import { userMutators } from "@repo/data/models/user/user-mutators";
import { env } from "@repo/env";
import { useEffect } from "react";
import { create } from "domain";
import { createUserRep } from "../store/create-user-rep";

export function useUser() {
  const { connectSocket } = useAppState.getState().actions;
  const { data, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch("/api/auth/session");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = (await response.json()) as Session;
      return data.user;
    },
  });

  if (!isPending && !data) throw Error("Error loading user");

  useEffect(() => {
    if (!isPending && data) {
      if (!useAppState.getState().userStore) createUserRep(data.id);
      if (!useAppState.getState().socket) connectSocket(data.id);
    }
  }, [data, isPending]);

  return data;
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSessionUser } from "./use-session-user";
import { User } from "@repo/data";

export function useCacheUser() {
  const [isCached, setIsCached] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionUser = useSessionUser();
  // const setUser = useAppSate

  useEffect(() => {
    // if the user has just logged in, cache the user data
    if (searchParams.has("login")) {
      localStorage.setItem("user", JSON.stringify(sessionUser));

      // To make sure the local replicache is initialized
      User.getInstance();
      setIsCached(true);
      // remove the login query param
      router.replace("/");
    } else {
      setIsCached(true);
    }
  }, []);

  return isCached;
}

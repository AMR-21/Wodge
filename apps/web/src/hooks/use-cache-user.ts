"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCurrentUser } from "./use-current-user";
import { useEffect } from "react";

export function useCacheUser() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionUser = useCurrentUser();

  useEffect(() => {
    // if the user has just logged in, cache the user data
    if (searchParams.has("login")) {
      localStorage.setItem("user", JSON.stringify(sessionUser));

      // remove the login query param
      router.replace("/");
    }
  }, []);
}

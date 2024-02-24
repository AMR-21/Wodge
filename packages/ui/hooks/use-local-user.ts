"use client";

import { useEffect, useState } from "react";
import { User } from "@repo/data/client-models";
import { useCacheUser } from "./use-cache-user";

/**
 * Get user instance
 */
export function useLocalUser() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    setUser(User.getInstance());
  }, []);

  return user;
}

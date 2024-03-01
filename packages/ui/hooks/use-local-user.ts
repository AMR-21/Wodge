"use client";

import { useEffect, useState } from "react";
import { User } from "@repo/data";

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

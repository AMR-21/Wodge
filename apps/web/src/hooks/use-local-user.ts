"use client";

import { User } from "../../../../packages/data/client-models";
import { useEffect, useState } from "react";
/**
 * Get local user data
 */
export function useLocalUser() {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    (async () => {
      setUser(await User.getInstance());
    })();
  }, []);

  return user;
}

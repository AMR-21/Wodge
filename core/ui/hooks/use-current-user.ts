"use client";

import { useSession } from "next-auth/react";

/*
 * Get remote session's user data
 */
export function useCurrentUser() {
  const session = useSession();
  return session?.data?.user;
}

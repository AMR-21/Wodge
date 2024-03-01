"use client";

import { useSession } from "next-auth/react";

/*
 * Get remote session's user data
 */
export function useSessionUser() {
  const session = useSession();

  if (!session.data || !session.data.user)
    throw new Error("Error getting user data from session");

  return session.data.user;
}

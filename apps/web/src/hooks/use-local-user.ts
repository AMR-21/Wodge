"use client";

import { User } from "@repo/data/client-models";

/**
 * Get local user data
 */
export async function useLocalUser() {
  const user = User.getInstance();
  return user.data;
}

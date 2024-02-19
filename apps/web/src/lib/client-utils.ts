import { User } from "@repo/data/client-models";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * Get remote session's user data
 */
export function useCurrentUser() {
  const session = useSession();
  return session?.data?.user;
}

export function uploadAvatar(file: File) {
  console.log(file);
}
/**
 * Get local user data
 */
export function useUser() {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    setUser(User.getInstance());
  }, []);

  return user;
}

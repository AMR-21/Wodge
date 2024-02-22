"use client";

import { User } from "../../../../packages/data/client-models";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useLogin() {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted) {
    if (searchParams.has("login")) {
      (async () => {
        try {
          const user = await User.getInstance();
          if (user.data) return router.replace("/");
          await user.getData();
          router.replace("/");
        } catch (e) {
          // TODO better handling by toasts
          console.error("Error getting user data");
        }
      })();
    }
  }
}

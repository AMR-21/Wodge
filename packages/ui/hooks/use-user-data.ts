"use client";

import { User } from "@repo/data/client-models";
import { LocalUserType } from "@repo/data/schemas";
import { useEffect, useState } from "react";

/**
 * Get user local data
 */
export function useUserData() {
  const [data, setData] = useState<LocalUserType>();

  useEffect(() => {
    setData(User.getInstance().data);
  }, []);

  return data;
}

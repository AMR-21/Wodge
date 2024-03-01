"use client";

import { User } from "@repo/data";
import { PublicUserType } from "@repo/data";
import { useEffect, useState } from "react";

/**
 * Get user local data
 */
export function useUserData() {
  const [data, setData] = useState<PublicUserType>();

  useEffect(() => {
    setData(User.getInstance().data);
  }, []);

  return data;
}

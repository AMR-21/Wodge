import { getAvatarAddress } from "@repo/data";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useAvatarUrl(id?: string) {
  const { data } = useQuery({
    queryKey: ["avatar", id],
    queryFn: async () => {
      const res = await fetch(getAvatarAddress(id));

      console.log(res);
      if (res.ok) {
        return getAvatarAddress(id);
      }

      return null;
    },
    enabled: !!id,
  });

  return data;
}

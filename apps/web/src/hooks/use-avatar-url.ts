import { useQuery } from "@tanstack/react-query";

import { getAvatarAddress } from "@repo/data";

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

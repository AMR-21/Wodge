import { useQuery } from "@tanstack/react-query";
import { env } from "@repo/env";
import { PublicUserType } from "@repo/data";
import { useCurrentWorkspace } from "./use-current-workspace";

export function useMembersInfo() {
  const {workspaceId} = useCurrentWorkspace();

  const { data, isPending } = useQuery({
    queryKey: [workspaceId, "members"],
    queryFn: async () => {
      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${workspaceId}/members-info`,
        {
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Failed to fetch members data");

      const data = (await res.json()) as PublicUserType[];
      return data;
    },
  });

  return { membersInfo: data || [], isMembersPending: isPending };
}

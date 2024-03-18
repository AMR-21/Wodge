import { useQuery } from "@tanstack/react-query";
import { useCurrentWorkspaceId } from "./use-current-workspace-id";
import { env } from "@repo/env";
import { PublicUserType } from "@repo/data";

export function useMemberInfo(memberId: string) {
  const workspaceId = useCurrentWorkspaceId();

  const { data, isPending } = useQuery({
    queryKey: [workspaceId, memberId],
    queryFn: async () => {
      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${workspaceId}/member-info`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ memberId }),
        },
      );

      if (!res.ok) throw new Error("Failed to fetch member data");

      const data = (await res.json()) as PublicUserType;
      console.log({ data });
      return data;
    },
  });

  return { memberInfo: data, isMemberPending: isPending };
}

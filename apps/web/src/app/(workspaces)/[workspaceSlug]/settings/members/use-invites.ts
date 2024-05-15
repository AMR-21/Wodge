"use client";

import { Invite, Invites } from "@repo/data";
import { env } from "@repo/env";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

function getInviteLink(invites?: Invites): Invite | undefined {
  if (!invites) return;
  const invite: [string, Invite] | undefined = Object.entries(invites).find(
    ([k, v]) => v.method === "link",
  );

  if (!invite) return;

  return invite[1];
}

export function useInvites() {
  const { workspaceId } = useCurrentWorkspace();

  const {
    data: invites,
    isPending,
    isError,
  } = useQuery<Invites>({
    queryKey: ["invites", workspaceId],
    queryFn: async () => {
      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${workspaceId}/invites`,
        {
          credentials: "include",
        },
      );
      return res.json();
    },
    enabled: !!workspaceId,
    staleTime: 0,
  });

  if (isError) toast.error("Failed to fetch invites");

  const inviteLink = getInviteLink(invites);

  return { invites, inviteLink, isPending };
}

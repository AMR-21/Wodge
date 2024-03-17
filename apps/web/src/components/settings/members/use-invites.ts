import { Invite, Invites } from "@repo/data";
import { env } from "@repo/env";
import { useCurrentWorkspaceId } from "@repo/ui/hooks/use-current-workspace-id";
import { useQuery } from "@tanstack/react-query";

function getInviteLink(invites?: Invites): Invite | undefined {
  if (!invites) return;
  const invite: [string, Invite] | undefined = Object.entries(invites).find(
    ([k, v]) => v.method === "link",
  );

  if (!invite) return;

  return invite[1];
}

export function useInvites() {
  const workspaceId = useCurrentWorkspaceId();

  const { data: invites, isPending } = useQuery<Invites>({
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
  });

  const inviteLink = getInviteLink(invites);

  return { invites, inviteLink, isPending };
}

import { Invite } from "@repo/data";
import { env } from "@repo/env";
import { toast } from "@repo/ui/components/ui/toast";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useCurrentWorkspaceId } from "@repo/ui/hooks/use-current-workspace-id";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { use } from "react";

export function useCreateInvite(setIsOpen: (open: boolean) => void) {
  const queryClient = useQueryClient();
  const workspaceId = useCurrentWorkspaceId();

  const { mutate: createInvite, isPending } = useMutation({
    mutationFn: async (data: Pick<Invite, "limit">) => {
      await fetch(
        `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${workspaceId}/create-invite`,
        { method: "POST", credentials: "include", body: JSON.stringify(data) },
      );

      queryClient.invalidateQueries({
        queryKey: ["invites", workspaceId],
      });
    },
    onSuccess: () => {
      toast.success("Invite link generated successfully");
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Failed to generate invite link");
    },
  });

  return { createInvite, isPending };
}

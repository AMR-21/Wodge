import { Invite } from "@repo/data";
import { env } from "@repo/env";
import { toast } from "@/components/ui/toast";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateInvite(setIsOpen: (open: boolean) => void) {
  const queryClient = useQueryClient();
  const { workspaceId } = useCurrentWorkspace();

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

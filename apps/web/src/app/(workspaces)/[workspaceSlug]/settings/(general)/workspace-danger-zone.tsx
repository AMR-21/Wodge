import { useIsOwnerOrAdmin } from "@/hooks/use-is-owner-or-admin";
import { SettingsContentAction } from "../settings";
import { useIsOwner } from "@/hooks/use-is-owner";
import { env } from "@repo/env";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function WorkspaceDangerZone() {
  const isManager = useIsOwnerOrAdmin();
  const isOwner = useIsOwner();
  const { workspaceId } = useCurrentWorkspace();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${workspaceId}/leave`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Failed to leave workspace");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-workspaces"],
      });
      router.push("/");
    },
    onError: () => {
      toast.error("Failed to leave workspace");
    },
  });

  const { mutate: deleteWorkspace, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${workspaceId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Failed to delete workspace");
    },
    onSuccess: () => {
      router.push("/");
    },
    onError: () => {
      toast.error("Failed to delete workspace");
    },
  });

  return (
    <div className="flex gap-4 ">
      {!isOwner && (
        <SettingsContentAction
          variant="destructive"
          onClick={() => mutate()}
          isPending={isPending}
          className="w-32"
        >
          Leave Workspace
        </SettingsContentAction>
      )}

      {isOwner && (
        <SettingsContentAction
          variant="destructive"
          className="w-32"
          onClick={() => deleteWorkspace()}
          isPending={isDeleting}
        >
          Delete Workspace
        </SettingsContentAction>
      )}
    </div>
  );
}

import { env } from "@repo/env";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDelete(
  domain: "user" | "workspace",
  id?: string,
  onSuccess?: () => void,
) {
  const { mutate: deleteAvatar, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!id) return false;
      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/${domain}/${id}/avatar`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to delete avatar");
      }

      return true;
    },
    onSuccess: () => {
      toast.success("Avatar deleted");
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast.error("Failed to delete avatar");
    },
  });

  return { deleteAvatar, isDeleting };
}

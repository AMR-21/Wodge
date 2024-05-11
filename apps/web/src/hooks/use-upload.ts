import { env } from "@repo/env";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpload(
  domain: "user" | "workspace",
  id?: string,
  onSuccess?: () => void,
) {
  const { mutate: upload, isPending: isUploading } = useMutation({
    mutationFn: async (data: FormData) => {
      if (!id) return false;

      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/${domain}/${id}/avatar`,
        {
          method: "POST",
          body: data,
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to upload avatar");
      }

      return true;
    },
    onSuccess: () => {
      toast.success("Avatar uploaded");
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast.error("Failed to upload avatar");
    },
  });
  return { upload, isUploading };
}

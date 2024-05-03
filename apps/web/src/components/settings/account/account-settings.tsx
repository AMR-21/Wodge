"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkspaceSchema, Workspace } from "@repo/data";

import {
  SettingsContentDescription,
  SettingsContentHeader,
  SettingsContentSection,
} from "../settings";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useIsOwnerOrAdmin } from "@repo/ui/hooks/use-is-owner-or-admin";
import { AvatarComp } from "@/components/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "@repo/env";
import { toast } from "@repo/ui/components/ui/toast";
import { useAvatarUrl } from "@repo/ui/hooks/use-avatar-url";
import { WorkspaceGeneralForm } from "../general/workspace-general-form";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { AccountGeneralForm } from "./account-general-form";
import { ModeToggle } from "@/components/toggle";

export function AccountSettings() {
  const { workspace, workspaceRep } = useCurrentWorkspace();

  const { user } = useCurrentUser();

  const queryClient = useQueryClient();

  const { mutate: upload, isPending: isUploading } = useMutation({
    mutationFn: async (data: FormData) => {
      if (!user?.id) return false;
      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/user/${user.id}/avatar`,
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
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: () => {
      toast.error("Failed to upload avatar");
    },
  });

  const { mutate: deleteAvatar, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!user?.id) return false;
      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/user/${user.id}/avatar`,
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
      //call backend
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: () => {
      toast.error("Failed to upload avatar");
    },
  });

  function onUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    upload(formData);
  }

  return (
    <div className="relative w-full shrink-0 grow divide-y-[1px] divide-border/70">
      <SettingsContentHeader
        label="Account"
        description="Manage your account settings"
      />
      <SettingsContentSection header="Avatar">
        <div className="space-y-3">
          <AvatarComp
            fallback={user?.displayName}
            onUpload={onUpload}
            onRemove={deleteAvatar}
            avatar={user?.avatar}
            isUploading={isUploading}
            isDeleting={isDeleting}
            className="rounded-full"
          />

          <SettingsContentDescription>
            Update your user avatar. Recommended is 256x256px
          </SettingsContentDescription>
        </div>
      </SettingsContentSection>

      <SettingsContentSection header="General">
        <AccountGeneralForm />
      </SettingsContentSection>

      <SettingsContentSection header="Theme">
        <ModeToggle />
      </SettingsContentSection>
    </div>
  );
}

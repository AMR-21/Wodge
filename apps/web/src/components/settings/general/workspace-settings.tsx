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
import { WorkspaceDangerZone } from "./workspace-danger-zone";
import { WorkspaceGeneralForm } from "./workspace-general-form";
import { useIsOwnerOrAdmin } from "@repo/ui/hooks/use-is-owner-or-admin";
import { AvatarComp } from "@/components/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "@repo/env";
import { toast } from "@repo/ui/components/ui/toast";
import { useAvatarUrl } from "@repo/ui/hooks/use-avatar-url";

export function WorkspaceSettings() {
  const { workspace, workspaceRep } = useCurrentWorkspace();

  const isManager = useIsOwnerOrAdmin();

  const avatar = useAvatarUrl("ws_" + workspace?.id ?? "");
  const queryClient = useQueryClient();
  console.log(avatar);
  const { mutate } = useMutation({
    mutationFn: async (data: FormData) => {
      if (!workspace?.id) return false;
      const res = await fetch(
        `${env.NEXT_PUBLIC_FS_DOMAIN}/object/avatars/ws_${workspace.id}`,
        {
          method: "POST",
          body: data,
        },
      );

      if (!res.ok) {
        throw new Error("Failed to upload avatar");
      }

      return true;
    },
    onSuccess: () => {
      toast.success("Avatar uploaded");
      console.log("Avatar uploaded");
      //call backend
      queryClient.invalidateQueries({
        queryKey: ["avatar", "ws_" + workspace?.id],
      });
    },
    onError: () => {
      toast.error("Failed to upload avatar");
    },
  });

  const { mutate: deleteAvatar } = useMutation({
    mutationFn: async (data: FormData) => {
      if (!workspace?.id) return false;
      const res = await fetch(
        `${env.NEXT_PUBLIC_FS_DOMAIN}/object/avatars/ws_${workspace.id}`,
        {
          method: "DELETE",
          body: data,
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
        queryKey: ["avatar", "ws_" + workspace?.id],
      });
    },
    onError: () => {
      toast.error("Failed to upload avatar");
    },
  });

  function onUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    mutate(formData);
  }

  return (
    <div className="relative w-full shrink-0 grow divide-y-[1px] divide-border/70">
      <SettingsContentHeader
        label="Workspace"
        {...(isManager && {
          description: "Manage workspace settings",
        })}
      />
      {isManager && (
        <>
          <SettingsContentSection header="Avatar">
            <div className="space-y-3">
              <AvatarComp
                fallback={workspace?.avatar}
                onUpload={onUpload}
                onRemove={deleteAvatar}
                avatar={avatar}
              />

              <SettingsContentDescription>
                Update your workspace avatar. Recommended is 256x256px
              </SettingsContentDescription>
            </div>
          </SettingsContentSection>

          <SettingsContentSection header="General">
            <WorkspaceGeneralForm />
          </SettingsContentSection>
        </>
      )}

      <SettingsContentSection header="Danger Zone">
        <WorkspaceDangerZone />
      </SettingsContentSection>
    </div>
  );
}

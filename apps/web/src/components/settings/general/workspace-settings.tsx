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
import { AvatarBtn } from "@/components/avatar-btn";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "@repo/env";
import { toast } from "@repo/ui/components/ui/toast";
import { useAvatarUrl } from "@repo/ui/hooks/use-avatar-url";
import { useUpload } from "@repo/ui/hooks/use-upload";
import { useDelete } from "@repo/ui/hooks/use-delete";

export function WorkspaceSettings() {
  const { workspace, workspaceRep } = useCurrentWorkspace();

  const isManager = useIsOwnerOrAdmin();

  const { upload, isUploading } = useUpload("workspace", workspace?.id);
  const { deleteAvatar, isDeleting } = useDelete("workspace", workspace?.id);

  function onUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    upload(formData);
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
              <AvatarBtn
                className="h-16 w-16 ring-2"
                fallback={workspace?.name}
                onUpload={onUpload}
                onRemove={deleteAvatar}
                avatar={workspace?.avatar}
                isUploading={isUploading}
                isDeleting={isDeleting}
                isSquare
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

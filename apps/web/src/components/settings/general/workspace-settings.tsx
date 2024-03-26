import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkspaceSchema, Workspace } from "@repo/data";

import { useEffect } from "react";
import {
  SettingsContentAction,
  SettingsContentDescription,
  SettingsContentHeader,
  SettingsContentSection,
} from "../settings";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Input } from "@repo/ui/components/ui/input";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { WorkspaceDangerZone } from "./workspace-danger-zone";
import { WorkspaceGeneralForm } from "./workspace-general-form";

export function WorkspaceSettings() {
  const { workspace, workspaceRep } = useCurrentWorkspace();
  const form = useForm<Workspace>({
    resolver: zodResolver(
      WorkspaceSchema.pick({ name: true, id: true, avatar: true }),
    ),
    defaultValues: {
      name: "",
      avatar: "",
      id: workspace?.id,
    },
  });

  return (
    <div className="relative w-full shrink-0 grow divide-y-[1px] divide-border/70">
      <SettingsContentHeader
        label="Workspace"
        description="Manage your workspace settings"
      />

      <SettingsContentSection header="Avatar">
        <div className="space-y-3">
          <Avatar className="h-16 w-16 rounded-md">
            {/* <AvatarImage src={workspace?.avatar} /> */}
            <AvatarFallback className="rounded-md text-lg uppercase transition-all  ">
              {workspace?.name[0]}
            </AvatarFallback>
          </Avatar>

          <SettingsContentDescription>
            Update your workspace avatar. Recommended is 256x256px
          </SettingsContentDescription>
        </div>
      </SettingsContentSection>

      <SettingsContentSection header="General">
        <WorkspaceGeneralForm />
      </SettingsContentSection>

      <SettingsContentSection header="Danger Zone">
        <WorkspaceDangerZone />
      </SettingsContentSection>
    </div>
  );
}

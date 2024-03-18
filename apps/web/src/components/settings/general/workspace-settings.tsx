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
import { Gate } from "../../gate";
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

export function WorkspaceSettings() {
  const { workspace } = useCurrentWorkspace();
  const form = useForm<Workspace>({
    resolver: zodResolver(WorkspaceSchema.pick({ name: true })),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (workspace) form.reset(workspace);
  }, [workspace]);

  async function onSubmit(data: Pick<Workspace, "name">) {
    // await workspace?.changeName(data.name);
    console.log("update workspace", data);
  }

  return (
    <div className="w-full shrink-0 grow divide-y-[1px] divide-border/70">
      <SettingsContentHeader
        label="Workspace"
        description="Manage your workspace settings"
      />

      <SettingsContentSection header="Avatar">
        <div className="space-y-3">
          <Avatar className="h-16 w-16 rounded-md">
            <AvatarImage src={workspace?.avatar} />
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Workspace Name</FormLabel>

                  <FormControl>
                    <Input {...field} className="w-3/4" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SettingsContentAction>Update</SettingsContentAction>
          </form>
        </Form>
      </SettingsContentSection>

      {workspace?.environment === "local" && (
        <>
          <SettingsContentSection header="Enable Cloud Access">
            <div className="space-y-4">
              <SettingsContentDescription>
                By default a workspace is created locally, enabling cloud access
                will allow you to save your workspace to the cloud, access it
                from anywhere, and invite collaborators.
              </SettingsContentDescription>

              <SettingsContentAction>Enable cloud access</SettingsContentAction>
            </div>
          </SettingsContentSection>
        </>
      )}

      <SettingsContentSection header="Danger Zone">
        <WorkspaceDangerZone />
      </SettingsContentSection>
    </div>
  );
}
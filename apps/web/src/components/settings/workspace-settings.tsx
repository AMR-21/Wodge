import { useForm } from "react-hook-form";
import { useCurrentWorkspace } from "../workspace/workspace-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkspaceSchema, WorkspaceType } from "@repo/data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@repo/ui";
import { useEffect } from "react";
import {
  SettingsContentAction,
  SettingsContentDescription,
  SettingsContentHeader,
  SettingsContentSection,
} from "./settings";
import { Gate } from "../gate";

export function WorkspaceSettings() {
  const { metadata, workspace } = useCurrentWorkspace();
  const form = useForm<WorkspaceType>({
    resolver: zodResolver(WorkspaceSchema.pick({ name: true })),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (metadata) form.reset(metadata);
  }, [metadata]);

  async function onSubmit(data: Pick<WorkspaceType, "name">) {
    await workspace?.changeName(data.name);
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
            <AvatarImage src={metadata?.avatar} />
            <AvatarFallback className="rounded-md text-lg uppercase transition-all  ">
              {metadata?.name[0]}
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

      {metadata?.environment === "local" && (
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
        <div className="flex gap-4 ">
          <SettingsContentAction variant="outline">
            Leave Workspace
          </SettingsContentAction>

          <Gate permissions={["admin"]}>
            <SettingsContentAction variant="destructive">
              Delete Workspace
            </SettingsContentAction>
          </Gate>
        </div>
      </SettingsContentSection>
    </div>
  );
}

import { useForm } from "react-hook-form";
import { useCurrentWorkspace } from "../workspace/workspace-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkspaceSchema, WorkspaceType } from "@repo/data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator,
} from "@repo/ui";
import { useEffect } from "react";
import {
  SettingsContentAction,
  SettingsContentDescription,
  SettingsContentHeader,
  SettingsContentSection,
} from "./settings";

export function WorkspaceGeneralForm() {
  const { metadata } = useCurrentWorkspace();
  const form = useForm({
    resolver: zodResolver(WorkspaceSchema),
    defaultValues: {
      id: "",
      owner: "",
      name: "",
      avatar: "",
      createdAt: new Date().toISOString(),
      environment: "local" as "cloud" | "local",
      settings: {},
    } satisfies WorkspaceType | undefined,
  });

  useEffect(() => {
    if (metadata) form.reset(metadata);
  }, [metadata]);

  function onSubmit(data: WorkspaceType) {
    console.log(data);
  }

  return (
    <div className="shrink-0 grow">
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

      <Separator />

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
      <Separator />

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
          <Separator />
        </>
      )}

      <SettingsContentSection header="Danger Zone">
        <div className="space-y-4">
          <SettingsContentDescription>
            Deleting a workspace is irreversible and will permanently delete all
            data and settings.
          </SettingsContentDescription>

          <SettingsContentAction variant="destructive">
            Delete Workspace
          </SettingsContentAction>
        </div>
      </SettingsContentSection>
    </div>
  );
}

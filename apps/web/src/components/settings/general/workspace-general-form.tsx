import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { SettingsContentAction, SettingsContentSection } from "../settings";
import { Input } from "@repo/ui/components/ui/input";
import { useForm } from "react-hook-form";
import { Workspace, WorkspaceSchema } from "@repo/data";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";

export function WorkspaceGeneralForm() {
  const { workspace, workspaceRep } = useCurrentWorkspace();

  const form = useForm<Workspace>({
    resolver: zodResolver(WorkspaceSchema.pick({ name: true, avatar: true })),
    defaultValues: {
      name: "",
      avatar: "",
    },
  });

  useEffect(() => {
    if (workspace) form.reset(workspace);
  }, [workspace]);

  async function onSubmit(data: Pick<Workspace, "name" | "avatar">) {
    await workspaceRep?.mutate.updateWorkspace({ update: data });
  }

  return (
    <div className="space-y-2">
      <p className="text-sm">Workspace Name</p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full gap-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormControl>
                  <Input {...field} className="basis-2/5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button size="sm" type="submit" disabled={!form.formState.isDirty}>
            Update
          </Button>
        </form>
      </Form>
    </div>
  );
}
